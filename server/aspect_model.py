import spacy
import pandas as pd
from tqdm import tqdm

def bin_age(age):
    try:
        age = int(age)
        if age < 20:
            return '<20'
        elif age < 30:
            return '20-29'
        elif age < 40:
            return '30-39'
        elif age < 50:
            return '40-49'
        else:
            return '50+'
    except:
        return 'Unknown'

def analyze_aspects(df):
    nlp = spacy.load('en_core_web_sm')
    FEATURES = {
        "camera": ["camera", "photo", "picture"],
        "battery": ["battery", "charge", "charging"],
        "performance": ["performance", "speed", "lag", "slow", "smooth"],
        "display": ["screen", "display", "resolution"],
        "sound": ["sound", "speaker", "audio"],
        "design": ["design", "look", "build", "style"],
        "price": ["price", "cost", "expensive", "cheap", "value"]
    }
    from spacy.matcher import PhraseMatcher
    matcher = PhraseMatcher(nlp.vocab, attr="LEMMA")
    for feature, terms in FEATURES.items():
        matcher.add(feature, [nlp(term) for term in terms])
    positive_words = {"good", "great", "excellent", "amazing", "awesome", "fantastic", "positive", "smooth"}
    negative_words = {"bad", "terrible", "poor", "awful", "slow", "negative", "laggy", "issue", "problem"}
    def extract_aspect_sentiment(text):
        doc = nlp(str(text).lower())
        matches = matcher(doc)
        results = {}
        for match_id, start, end in matches:
            span = doc[start:end]
            feature = nlp.vocab.strings[match_id]
            sent = span.sent
            sent_words = {token.lemma_ for token in sent}
            polarity = "NEUTRAL"
            if sent_words & positive_words:
                polarity = "POSITIVE"
            if sent_words & negative_words:
                polarity = "NEGATIVE"
            if polarity != "NEUTRAL":
                results[feature] = polarity
        return results
    tqdm.pandas()
    df["aspect_sentiments"] = df["Cleaned Review"].progress_apply(extract_aspect_sentiment)
    return df

def group_sentiment_simple(df, group_col):
    all_records = []
    for i, row in df.iterrows():
        aspects = row["aspect_sentiments"]
        for feat, senti in aspects.items():
            all_records.append({
                group_col: row.get(group_col, None),
                "sentiment": senti
            })
    group_df = pd.DataFrame(all_records)
    if group_df.empty:
        return []
    summary = group_df.groupby([group_col, "sentiment"]).size().unstack(fill_value=0).reset_index()
    summary = summary.rename(columns={group_col: group_col})
    return summary.to_dict(orient="records")

def overall_sentiment(df):
    all_sentiments = []
    for aspects in df["aspect_sentiments"]:
        for feat, senti in aspects.items():
            all_sentiments.append(senti)
    from collections import Counter
    counts = Counter(all_sentiments)
    return [{"sentiment": k, "count": v} for k, v in counts.items()]

def feature_summary(df):
    all_records = []
    for i, row in df.iterrows():
        aspects = row["aspect_sentiments"]
        for feat, senti in aspects.items():
            all_records.append({"feature": feat, "sentiment": senti})
    feature_df = pd.DataFrame(all_records)
    if feature_df.empty:
        return []
    summary = feature_df.groupby(["feature", "sentiment"]).size().unstack(fill_value=0).reset_index()
    return summary.to_dict(orient="records")
