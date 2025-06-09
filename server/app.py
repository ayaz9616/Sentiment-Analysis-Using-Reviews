from flask import Flask, request, jsonify
import pandas as pd
from aspect_model import analyze_aspects, group_sentiment_simple, overall_sentiment, feature_summary, bin_age
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400
    try:
        df = pd.read_csv(file)
    except pd.errors.EmptyDataError:
        return jsonify({'error': 'Uploaded file is empty or not a valid CSV.'}), 400
    except Exception as e:
        return jsonify({'error': f'Failed to read CSV: {str(e)}'}), 400
    if df.empty or len(df.columns) == 0:
        return jsonify({'error': 'CSV file has no data or columns.'}), 400
    # Bin age
    if 'Age' in df.columns:
        df['Age'] = df['Age'].apply(bin_age)
    df = analyze_aspects(df)
    # Feature summary
    feature_data = feature_summary(df)
    # Overall summary
    overall_data = overall_sentiment(df)
    # Grouped summaries
    brand_data = group_sentiment_simple(df, 'Brand') if 'Brand' in df.columns else []
    product_data = group_sentiment_simple(df, 'Product Name') if 'Product Name' in df.columns else []
    rating_data = group_sentiment_simple(df, 'Rating') if 'Rating' in df.columns else []
    platform_data = group_sentiment_simple(df, 'Platform') if 'Platform' in df.columns else []
    gender_data = group_sentiment_simple(df, 'Gender') if 'Gender' in df.columns else []
    verified_data = group_sentiment_simple(df, 'Verified Purchase') if 'Verified Purchase' in df.columns else []
    age_data = group_sentiment_simple(df, 'Age') if 'Age' in df.columns else []
    return jsonify({
        'feature_summary': feature_data,
        'overall_summary': overall_data,
        'sentiment_by_brand': brand_data,
        'sentiment_by_product': product_data,
        'sentiment_by_rating': rating_data,
        'sentiment_by_platform': platform_data,
        'sentiment_by_gender': gender_data,
        'sentiment_by_verified': verified_data,
        'sentiment_by_age': age_data
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
