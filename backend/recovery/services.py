import os
import json
from anthropic import Anthropic

from .models import Transaction, AuditLog, RecoveryResult

class RecoveryService:
    def __init__(self):
        self.anthropic = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
    
    def process(self, transaction):
        """Process a single transaction with AI"""
        
        # 1. AI Diagnosis
        diagnosis = self._diagnose(transaction)
        
        # 2. Policy Check
        action = self._policy_check(transaction, diagnosis)
        
        # 3. Execute
        result = self._execute(transaction, action)
        
        # 4. Audit
        self._audit(transaction, action, result)
        
        return result
    
    def _diagnose(self, transaction):
        """Claude AI diagnosis"""
        prompt = f"""
        Analyze payment failure:
        - Amount: ₹{transaction.amount}
        - Failure: {transaction.failure_reason}
        - Retries: {transaction.retry_count}
        Recommend recovery action.
        """
        
        response = self.anthropic.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=200,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text
    
    def _policy_check(self, transaction, diagnosis):
        """Deterministic policy validation"""
        # Rule R-03: Max retry check
        if transaction.retry_count >= 3:
            return {'action': 'escalate', 'reason': 'Max retries exhausted'}
        
        # Rule R-02: Fraud check
        if 'fraud' in transaction.failure_reason.lower():
            return {'action': 'fraud_review', 'reason': 'Fraud suspected'}
        
        return {'action': 'retry', 'reason': 'Policy allowed'}
    
    def _execute(self, transaction, action):
        """Execute recovery action"""
        if action['action'] == 'retry':
            # Simulate retry
            import random
            success = random.random() > 0.3
            return {
                'recovered': success,
                'amount': transaction.amount if success else 0,
                'action': 'retry_payment',
                'status': 'success' if success else 'failed'
            }
        else:
            return {
                'recovered': False,
                'amount': 0,
                'action': action['action'],
                'status': 'pending',
                'reason': action['reason']
            }
    
    def _audit(self, transaction, action, result):
        """Create audit log"""
        AuditLog.objects.create(
            transaction=transaction,
            action=action['action'],
            status=result.get('status', 'pending'),
            details=json.dumps(result)
        )
        
        RecoveryResult.objects.create(
            transaction=transaction,
            is_recovered=result.get('recovered', False),
            amount_recovered=result.get('amount', 0),
            action_taken=action['action']
        )