"""
train_model.py - Train ML Recovery Model
Trains RandomForest model on synthetic data
"""

import os
import sys
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Get the directory where this file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)

def train_model():
    """Train the recovery prediction model"""
    
    # Load data - check multiple locations
    data_paths = [
        os.path.join(ROOT_DIR, 'data', 'payments.csv'),
        os.path.join(BASE_DIR, '..', 'data', 'payments.csv'),
    ]
    
    data_path = None
    for path in data_paths:
        if os.path.exists(path):
            data_path = path
            break
    
    if not data_path:
        print("❌ Error: payments.csv not found!")
        print(f"   Searched in: {data_paths}")
        return False
    
    print(f"✅ Loading data from: {data_path}")
    
    # Read data
    df = pd.read_csv(data_path)
    
    # Filter only failed transactions with recovery labels
    df_failed = df[df['payment_status'] == 'Failed'].copy()
    df_failed = df_failed.dropna(subset=['recovered_after_retry'])
    
    if len(df_failed) < 50:
        print(f"❌ Error: Not enough failed transactions with labels. Found: {len(df_failed)}")
        return False
    
    print(f"✅ Using {len(df_failed)} failed transactions for training")
    
    # Features
    features = ['amount', 'retry_count', 'payment_method', 'failure_reason', 'customer_segment']
    
    # Prepare features with one-hot encoding
    X = pd.get_dummies(df_failed[features])
    y = df_failed['recovered_after_retry']
    
    print(f"✅ Features: {len(X.columns)} columns")
    
    # Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )
    
    # Train RandomForest
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    
    metrics = {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred),
        'recall': recall_score(y_test, y_pred),
        'f1': f1_score(y_test, y_pred)
    }
    
    print("\n" + "="*50)
    print("📊 MODEL EVALUATION METRICS")
    print("="*50)
    print(f"✅ Accuracy:  {metrics['accuracy']:.4f}")
    print(f"✅ Precision: {metrics['precision']:.4f}")
    print(f"✅ Recall:    {metrics['recall']:.4f}")
    print(f"✅ F1 Score:  {metrics['f1']:.4f}")
    print("="*50)
    
    # Save model
    model_dir = os.path.join(BASE_DIR)
    model_path = os.path.join(model_dir, 'recovery_model.pkl')
    joblib.dump({
        'model': model,
        'features': X.columns.tolist()
    }, model_path)
    
    print(f"✅ Model saved to: {model_path}")
    print(f"✅ Feature columns: {len(X.columns)}")
    
    return True

if __name__ == "__main__":
    print("\n🚀 Starting ML Model Training...")
    print("="*50)
    
    success = train_model()
    
    if success:
        print("\n🎉 Training completed successfully!")
    else:
        print("\n Training failed. Please check the errors above.")
        sys.exit(1)