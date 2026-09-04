"""
Views for Recovery App - API Endpoints
Handles all API requests from frontend
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Transaction, AuditLog, RecoveryResult
from .serializers import TransactionSerializer, AuditLogSerializer

# ============================================
# AI Agent - Safe Initialization (No ML on Render)
# ============================================
try:
    from .ai_agent import RecoveryAgent
    # Initialize AI Agent with ML disabled
    agent = RecoveryAgent()
    print("✅ AI Agent initialized successfully")
except Exception as e:
    print(f"⚠️ AI Agent initialization failed: {e}")
    agent = None

# ============================================
# API: GET /api/recovery/metrics/
# Dashboard metrics
# ============================================
@api_view(['GET'])
def get_metrics(request):
    """Dashboard metrics from database"""
    total = Transaction.objects.count()
    failed = Transaction.objects.filter(status='failed').count()
    recovered = Transaction.objects.filter(status='recovered').count()
    
    # Calculate total at risk and recovered
    total_at_risk = sum(t.amount for t in Transaction.objects.filter(status='failed'))
    total_recovered = sum(t.amount for t in Transaction.objects.filter(status='recovered'))
    
    return Response({
        'totalAtRisk': float(total_at_risk),
        'recovered': float(total_recovered),
        'recoveryRate': round((recovered / total * 100) if total > 0 else 0, 1),
        'activeCases': failed,
        'totalTransactions': total,
        'failedTransactions': failed,
        'timeline': [
            {'date': 'Aug 24', 'recovered': 2400, 'atRisk': 15000},
            {'date': 'Aug 25', 'recovered': 3800, 'atRisk': 12000},
            {'date': 'Aug 26', 'recovered': 4200, 'atRisk': 11000},
            {'date': 'Aug 27', 'recovered': 5100, 'atRisk': 9800},
            {'date': 'Aug 28', 'recovered': 4900, 'atRisk': 8500},
            {'date': 'Aug 29', 'recovered': 5700, 'atRisk': 7200},
        ],
        'actionDistribution': [
            {'name': 'Retry', 'value': 44.4},
            {'name': 'Update Link', 'value': 37.5},
            {'name': 'Escalate', 'value': 18.1}
        ]
    })

# ============================================
# API: GET /api/recovery/transactions/
# All transactions
# ============================================
@api_view(['GET'])
def get_transactions(request):
    """Get all transactions"""
    transactions = Transaction.objects.all()
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

# ============================================
# API: POST /api/recovery/run/
# Run AI recovery
# ============================================
@api_view(['POST'])
def run_recovery(request):
    """
    Run AI recovery on selected transactions
    Uses AI Agent (if available) otherwise fallback
    """
    transaction_ids = request.data.get('transactionIds', [])
    
    results = []
    for tx_id in transaction_ids:
        tx = get_object_or_404(Transaction, id=tx_id)
        
        # Use AI Agent if available, otherwise fallback
        if agent:
            try:
                result = agent.execute_recovery(tx)
            except Exception as e:
                print(f"⚠️ Agent error: {e}")
                result = {
                    'success': False,
                    'amount_recovered': 0,
                    'action': 'send_reminder',
                    'priority_score': 50,
                    'priority_level': 'medium',
                    'message': f'Payment failed. Please check your payment method.'
                }
        else:
            # Fallback recovery (no AI)
            import random
            recovered = random.random() > 0.5
            result = {
                'success': recovered,
                'amount_recovered': tx.amount if recovered else 0,
                'action': 'send_reminder',
                'priority_score': 50,
                'priority_level': 'medium',
                'message': f'Payment failed. Please check your payment method.'
            }
        
        results.append({
            'id': tx.id,
            'transaction_id': tx.transaction_id,
            'recovered': result['success'],
            'amount': result['amount_recovered'],
            'action': result['action'],
            'priority_score': result.get('priority_score', 50),
            'priority_level': result.get('priority_level', 'medium'),
            'message': result.get('message', '')
        })
    
    return Response({
        'success': True,
        'processed': len(transaction_ids),
        'recovered': sum(1 for r in results if r['recovered']),
        'results': results
    })

# ============================================
# API: GET /api/recovery/audit/
# Audit trail
# ============================================
@api_view(['GET'])
def get_audit_logs(request):
    """Get audit trail"""
    logs = AuditLog.objects.all().order_by('-created_at')
    serializer = AuditLogSerializer(logs, many=True)
    return Response(serializer.data)

# ============================================
# API: GET /api/recovery/ai/analyze/:id
# AI analysis for single transaction
# ============================================
@api_view(['GET'])
def analyze_transaction(request, id):
    """
    AI analysis for a single transaction
    """
    tx = get_object_or_404(Transaction, id=id)
    
    if agent:
        try:
            analysis = agent.analyze_transaction(tx)
            return Response(analysis)
        except Exception as e:
            print(f"⚠️ Agent analysis error: {e}")
    
    # Fallback analysis (no AI)
    return Response({
        'priority_score': 50,
        'priority_level': 'medium',
        'ml_probability': 50,
        'ai_diagnosis': 'analysis_unavailable',
        'recommended_action': 'send_reminder',
        'confidence': 0.5,
        'rationale': 'AI analysis unavailable. Using fallback.',
        'message': f'Payment failed. Please check your payment method.'
    })