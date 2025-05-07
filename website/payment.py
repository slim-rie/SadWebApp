import requests
from paymongo import Paymongo
from flask import current_app

# Initialize PayMongo with your API key
paymongo = Paymongo('sk_test_tbbxHKPHaBn4Gvwx8D1ivStx')

PAYMONGO_SECRET_KEY = 'sk_test_tbbxHKPHaBn4Gvwx8D1ivStx'
PAYMONGO_API_URL = 'https://api.paymongo.com/v1/sources'

def create_payment_intent(amount, currency='PHP'):
    try:
        # Create a payment intent for card, gcash, and paymaya
        payment_intent = paymongo.payment_intent.create(
            amount=amount,
            currency=currency,
            payment_method_allowed=['card', 'gcash', 'paymaya'],
            payment_method_options={
                'card': {
                    'request_three_d_secure': 'any'
                }
            }
        )
        return payment_intent
    except Exception as e:
        current_app.logger.error(f"Error creating payment intent: {str(e)}")
        return None

def create_ewallet_source(amount, type, currency='PHP', redirect_url=None):
    try:
        # Fix Maya type
        if type == 'paymaya' or type == 'paymaya_wallet':
            type = 'paymaya'
        import base64
        b64key = base64.b64encode(f'{PAYMONGO_SECRET_KEY}:'.encode()).decode()
        data = {
            "data": {
                "attributes": {
                    "amount": int(amount),
                    "redirect": {
                        "success": redirect_url or "https://google.com",
                        "failed": redirect_url or "https://google.com"
                    },
                    "type": type,
                    "currency": currency
                }
            }
        }
        response = requests.post(
            PAYMONGO_API_URL,
            json=data,
            headers={
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': f'Basic {b64key}'
            }
        )
        if response.status_code == 201:
            return response.json()['data']['attributes']['redirect']['checkout_url']
        elif response.status_code == 200:
            return response.json()['data']['attributes']['redirect']['checkout_url']
        else:
            current_app.logger.error(f"PayMongo source error: {response.text}")
            return None
    except Exception as e:
        current_app.logger.error(f"Error creating e-wallet source: {str(e)}")
        return None

def process_payment(payment_method_id, amount, currency='PHP'):
    try:
        # Create payment intent
        payment_intent = create_payment_intent(amount, currency)
        if not payment_intent:
            return False, "Failed to create payment intent"

        # Attach payment method to intent
        payment_intent = paymongo.payment_intent.attach(
            payment_intent.id,
            payment_method_id
        )

        # Confirm the payment
        payment_intent = paymongo.payment_intent.confirm(payment_intent.id)
        
        if payment_intent.status == 'succeeded':
            return True, "Payment successful"
        else:
            return False, f"Payment failed: {payment_intent.status}"

    except Exception as e:
        current_app.logger.error(f"Error processing payment: {str(e)}")
        return False, str(e) 