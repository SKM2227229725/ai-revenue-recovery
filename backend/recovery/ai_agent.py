"""
AI Agent - Complete Recovery Intelligence
Combines Claude AI, Priority Score, and Message Generator
ML model disabled for Render deployment
"""

import os
import json
import random
from django.conf import settings
from .models import Transaction, AuditLog, RecoveryResult

# ============================================
# Try to import Anthropic (optional)
# ============================================
try:
    from anthropic import Anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False
    print("⚠️ Anthropic not installed. Using fallback mode.")


class RecoveryAgent:
    """
    Complete AI Recovery Agent
    
    Features:
    - Claude AI diagnosis (optional)
    - Priority scoring (weighted formula)
    - Action decision engine
    - Personalized message generation
    - Audit logging
    
    ML Model disabled for Render deployment (avoids segmentation fault)
    """
    
    def __init__(self):
        # ============================================
        # Claude AI (optional)
        # ============================================
        self.api_key = os.getenv('ANTHROPIC_API_KEY', '')
        self.client = None
        if HAS_ANTHROPIC and self.api_key:
            try:
                self.client = Anthropic(api_key=self.api_key)
                print("✅ Claude AI initialized")
            except Exception as e:
                print(f"⚠️ Claude initialization failed: {e}")
                self.client = None
        
        # ============================================
        # ML Model - DISABLED FOR RENDER
        # ============================================
        self.model = None
        self.features = []
        
        # ❌ ML model loading disabled (causes segmentation fault on Render)
        # self._load_model()
        print("ℹ️ ML model disabled for Render deployment")
    
    def _load_model(self):
        """Load the trained ML model - DISABLED"""
        # This method is intentionally empty to avoid segmentation fault
        pass
    
    def analyze_transaction(self, transaction):
        """
        Complete analysis of a transaction
        
        Returns:
        {
            'priority_score': 0-100,
            'priority_level': 'high/medium/low',
            'ml_probability': 0-100,
            'ai_diagnosis': '...',
            'recommended_action': '...',
            'confidence': 0-1,
            'rationale': '...',
            'message': '...'
        }
        """
        
        # 1. Calculate Priority Score
        priority_score = self._calculate_priority(transaction)
        priority_level = self._get_priority_level(priority_score)
        
        # 2. ML Prediction - FIXED VALUE (ML disabled)
        ml_probability = 50.0  # Default value
        
        # 3. AI Diagnosis (Claude or Fallback)
        ai_diagnosis = self._diagnose(transaction)
        
        # 4. Decision Engine
        action = self._decide_action(
            transaction, 
            priority_score, 
            ml_probability, 
            ai_diagnosis
        )
        
        # 5. Generate Message
        message = self._generate_message(transaction, action)
        
        return {
            'priority_score': priority_score,
            'priority_level': priority_level,
            'ml_probability': ml_probability,
            'ai_diagnosis': ai_diagnosis.get('diagnosis', 'unknown'),
            'recommended_action': action['action'],
            'confidence': action['confidence'],
            'rationale': action['rationale'],
            'message': message
        }
    
    def _calculate_priority(self, transaction):
        """
        Calculate priority score (0-100)
        
        Weighted Formula:
        - Amount: 40%
        - Recoverability: 25%
        - Customer Segment: 15%
        - Customer History: 10%
        - Retry Count: 10%
        """
        weights = {
            'amount': 0.40,
            'recoverability': 0.25,
            'segment': 0.15,
            'history': 0.10,
            'retry': 0.10
        }
        
        # ============================================
        # 1. Amount Score (40%)
        # ============================================
        max_amount = 50000
        amount_score = min(float(transaction.amount) / max_amount, 1.0) * 100
        
        # ============================================
        # 2. Recoverability Score (25%)
        # ============================================
        recoverability_map = {
            'Network Failure': 0.90,
            'Bank Server Issue': 0.80,
            'Authentication Failure': 0.70,
            'Card Declined': 0.55,
            'Insufficient Funds': 0.45,
            'Expired Card': 0.35,
            'Unknown Error': 0.25,
            None: 0.30
        }
        recoverability_score = recoverability_map.get(
            getattr(transaction, 'failure_reason', None), 0.25
        ) * 100
        
        # ============================================
        # 3. Customer Segment Score (15%)
        # ============================================
        segment = getattr(transaction, 'customer_segment', 'Regular')
        segment_map = {'Premium': 1.0, 'Regular': 0.65, 'New': 0.35}
        segment_score = segment_map.get(segment, 0.5) * 100
        
        # ============================================
        # 4. Customer History Score (10%)
        # ============================================
        history = getattr(transaction, 'customer_history', 'Regular Customer')
        history_map = {
            'Loyal Customer': 1.0,
            'Regular Customer': 0.75,
            'Occasional Buyer': 0.45,
            'New Customer': 0.2
        }
        history_score = history_map.get(history, 0.3) * 100
        
        # ============================================
        # 5. Retry Count Score (10%)
        # ============================================
        retry_count = getattr(transaction, 'retry_count', 0)
        retry_score = max(1.0 - (retry_count * 0.2), 0.2) * 100
        
        # ============================================
        # Weighted Total
        # ============================================
        total = (
            weights['amount'] * amount_score +
            weights['recoverability'] * recoverability_score +
            weights['segment'] * segment_score +
            weights['history'] * history_score +
            weights['retry'] * retry_score
        )
        
        return round(total, 2)
    
    def _get_priority_level(self, score):
        """Convert score to priority level"""
        if score >= 65:
            return 'high'
        elif score >= 40:
            return 'medium'
        else:
            return 'low'
    
    def _predict_recovery(self, transaction):
        """
        Predict recovery likelihood - FIXED VALUE
        ML model disabled for Render
        """
        return 50.0  # Default value
    
    def _diagnose(self, transaction):
        """Diagnose using Claude AI or fallback"""
        if self.client:
            return self._diagnose_with_claude(transaction)
        else:
            return self._fallback_diagnosis(transaction)
    
    def _diagnose_with_claude(self, transaction):
        """Diagnose using Claude AI"""
        prompt = f"""
        Analyze this payment failure:
        - Transaction: {transaction.transaction_id}
        - Amount: ₹{transaction.amount}
        - Method: {transaction.payment_method}
        - Failure: {transaction.failure_reason}
        - Retries: {transaction.retry_count}
        - Customer: {transaction.customer_segment}
        
        Return JSON:
        {{
            "diagnosis": "root cause",
            "recommended_action": "retry_payment|send_update_link|send_reminder|escalate_to_human",
            "confidence": 0.85,
            "rationale": "why"
        }}
        """
        
        try:
            response = self.client.messages.create(
                model="claude-3-5-sonnet-20240620",
                max_tokens=300,
                messages=[{"role": "user", "content": prompt}]
            )
            return json.loads(response.content[0].text)
        except Exception as e:
            print(f"⚠️ Claude API error: {e}")
            return self._fallback_diagnosis(transaction)
    
    def _fallback_diagnosis(self, transaction):
        """Rule-based fallback when Claude is unavailable"""
        reason = str(getattr(transaction, 'failure_reason', '') or '').lower()
        
        if 'insufficient' in reason:
            return {
                'diagnosis': 'insufficient_funds',
                'recommended_action': 'send_reminder',
                'confidence': 0.6,
                'rationale': 'Customer may have funds after few days'
            }
        elif 'expired' in reason:
            return {
                'diagnosis': 'card_expired',
                'recommended_action': 'send_update_link',
                'confidence': 0.8,
                'rationale': 'Customer needs to update payment method'
            }
        elif 'network' in reason or 'timeout' in reason or 'server' in reason:
            return {
                'diagnosis': 'network_issue',
                'recommended_action': 'retry_payment',
                'confidence': 0.7,
                'rationale': 'Transient failure, retry likely to succeed'
            }
        elif 'fraud' in reason:
            return {
                'diagnosis': 'fraud_suspected',
                'recommended_action': 'escalate_to_human',
                'confidence': 0.9,
                'rationale': 'Fraud suspected - manual review needed'
            }
        else:
            return {
                'diagnosis': 'unknown',
                'recommended_action': 'escalate_to_human',
                'confidence': 0.3,
                'rationale': 'Unable to determine root cause'
            }
    
    def _decide_action(self, transaction, priority_score, ml_probability, ai_diagnosis):
        """
        Decision engine combining all signals
        
        Policy Rules:
        - Max retry count: 3
        - Fraud detection: Auto-block
        - Low ML probability: Escalate
        - Low priority: Send reminder
        """
        action = ai_diagnosis.get('recommended_action', 'escalate_to_human')
        confidence = ai_diagnosis.get('confidence', 0.5)
        rationale = ai_diagnosis.get('rationale', 'AI recommendation')
        
        # ============================================
        # Policy Rule 1: Max retry count
        # ============================================
        if getattr(transaction, 'retry_count', 0) >= 3:
            return {
                'action': 'escalate_to_human',
                'confidence': 0.9,
                'rationale': 'Max retry count exceeded'
            }
        
        # ============================================
        # Policy Rule 2: Fraud detection
        # ============================================
        if getattr(transaction, 'failure_reason', '') and 'fraud' in str(transaction.failure_reason).lower():
            return {
                'action': 'fraud_review',
                'confidence': 0.95,
                'rationale': 'Fraud suspected - manual review needed'
            }
        
        # ============================================
        # Policy Rule 3: ML probability (disabled)
        # ============================================
        if ml_probability < 30:
            return {
                'action': 'escalate_to_human',
                'confidence': 0.7,
                'rationale': f'ML model predicts low recovery probability ({ml_probability}%)'
            }
        
        # ============================================
        # Policy Rule 4: Priority score
        # ============================================
        if priority_score < 40:
            return {
                'action': 'send_reminder',
                'confidence': 0.5,
                'rationale': f'Low priority transaction ({priority_score}%) - send reminder'
            }
        
        return {
            'action': action,
            'confidence': confidence,
            'rationale': rationale
        }
    
    def _generate_message(self, transaction, action):
        """Generate personalized message"""
        templates = {
            'send_reminder': f"Dear {transaction.customer_name}, your payment of ₹{transaction.amount} failed due to insufficient funds. Please check your balance and try again.",
            'send_update_link': f"Dear {transaction.customer_name}, your payment of ₹{transaction.amount} failed because your card expired. Please update your payment method.",
            'retry_payment': f"Dear {transaction.customer_name}, your payment of ₹{transaction.amount} encountered a temporary issue. We will retry automatically.",
            'escalate_to_human': f"Dear {transaction.customer_name}, we noticed an issue with your payment of ₹{transaction.amount}. Our support team will contact you.",
            'fraud_review': f"Dear {transaction.customer_name}, we've detected unusual activity on your payment of ₹{transaction.amount}. Please contact support."
        }
        return templates.get(action['action'], "Please check your payment method and try again.")
    
    def execute_recovery(self, transaction):
        """
        Execute full recovery workflow
        
        Returns:
        {
            'success': bool,
            'amount_recovered': float,
            'action': str,
            'message': str
        }
        """
        analysis = self.analyze_transaction(transaction)
        action = analysis['recommended_action']
        
        # ============================================
        # Simulate execution based on action
        # ============================================
        recovered = False
        amount_recovered = 0
        
        if action == 'retry_payment':
            # Retry with 50% success rate (ML disabled)
            prob = 0.5
            recovered = random.random() < prob
            if recovered:
                amount_recovered = float(transaction.amount)
                
        elif action in ['send_reminder', 'send_update_link']:
            # These actions have lower success rate (30%)
            recovered = random.random() < 0.3
            if recovered:
                amount_recovered = float(transaction.amount)
                
        elif action == 'escalate_to_human':
            # Escalation requires human intervention
            recovered = False
            amount_recovered = 0
        
        # ============================================
        # Save result to database
        # ============================================
        try:
            RecoveryResult.objects.create(
                transaction=transaction,
                is_recovered=recovered,
                amount_recovered=amount_recovered,
                action_taken=action
            )
        except Exception as e:
            print(f"⚠️ Error saving RecoveryResult: {e}")
        
        # ============================================
        # Update transaction status
        # ============================================
        if recovered:
            try:
                transaction.status = 'recovered'
                transaction.save()
            except Exception as e:
                print(f"⚠️ Error updating transaction: {e}")
        
        # ============================================
        # Create audit log
        # ============================================
        try:
            AuditLog.objects.create(
                transaction=transaction,
                action=action,
                status='success' if recovered else 'failed',
                details=json.dumps({
                    'priority_score': analysis.get('priority_score', 50),
                    'ml_probability': analysis.get('ml_probability', 50),
                    'confidence': analysis.get('confidence', 0.5),
                    'rationale': analysis.get('rationale', '')
                })
            )
        except Exception as e:
            print(f"⚠️ Error creating AuditLog: {e}")
        
        return {
            'success': recovered,
            'amount_recovered': amount_recovered,
            'action': action,
            'message': analysis.get('message', 'Payment failed. Please try again.'),
            'priority_score': analysis.get('priority_score', 50),
            'priority_level': analysis.get('priority_level', 'medium')
        }