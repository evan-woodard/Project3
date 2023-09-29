# Import necessary modules
import pandas as pd
import sqlite3
from flask import Flask, render_template, jsonify
import numpy as np

cnx = sqlite3.connect('Project3')
columned_df = pd.read_sql_query("SELECT County, ModelYear, Make, Model, ElectricVehicleType, ElectricRange FROM cars", cnx)

bev_df = columned_df[columned_df['ElectricVehicleType'] == 'Battery Electric Vehicle (BEV)']

# Convert 'ElectricRange' to integers directly when creating bev_df
bev_df['ElectricRange'] = bev_df['ElectricRange'].astype(int)

# Filter the DataFrame to remove rows with ElectricRange == 0
final_df = bev_df[bev_df['ElectricRange'] != 0]

# Calculate the mean directly on 'final_df' and reset the index
bar_df = final_df.groupby(['Model'])['ElectricRange'].mean().reset_index()

app = Flask(__name__)
app.static_folder = 'static'  # Set the static folder
app.template_folder = 'templates'  # Set the templates folder

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/bar", methods=['GET'])
def barChart():
    bar_df = final_df.groupby(['Model'])['ElectricRange'].mean().reset_index()
    barData = []
    for index, row in bar_df.iterrows():
        bar_plot = {'Model': row['Model'], 'ElectricRange': int(row['ElectricRange'])}
        barData.append(bar_plot)
    sorted_barData = sorted(barData, key=lambda x: x['ElectricRange'])
    return jsonify(sorted_barData)

@app.route('/pie', methods=['GET'])
def pieChart():
    bins = [0, 100, 150, 200, 250, np.inf]
    labels = ['<100', '101-150', '151-200', '201-250', '251+']

    final_df['RangeCategory'] = pd.cut(final_df['ElectricRange'], bins=bins, labels=labels)
    range_counts = final_df['RangeCategory'].value_counts()
    pie_plot = range_counts.to_dict()
    sorted_pie_plot = dict(sorted(pie_plot.items(), key=lambda item: item[1], reverse=True))

    return jsonify(sorted_pie_plot)

# @app.route('/line', methods=['GET'])
# def lineChart():
#     filtered_df = final_df[(final_df['Make'] == 'TESLA') & (final_df['ModelYear'].astype(int) <= 2020)]
#
#     # Create a list of dictionaries from the filtered DataFrame
#     data_dict = []
#     for index, row in filtered_df.iterrows():
#         row_dict = {
#             'ModelYear': int(row['ModelYear']),
#             'ElectricRange': int(row['ElectricRange'])
#         }
#         data_dict.append(row_dict)
#
#     return jsonify(data_dict)


if __name__ == "__main__":
    app.run(debug=True)
