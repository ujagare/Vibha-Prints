"""
Load Testing with Locust
Tests platform under realistic load conditions
"""

from locust import HttpUser, task, between, events
import random
import json

# ============================================================================
# TEST DATA
# ============================================================================

SAMPLE_NAMES = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams", "Charlie Brown"]
SAMPLE_MESSAGES = [
    "I need a website for my business",
    "Looking for ecommerce solution",
    "Want to build a SaaS platform",
    "Need SEO optimization",
    "Interested in digital marketing"
]

SAMPLE_CHAT_MESSAGES = [
    "What services do you offer?",
    "How much does a website cost?",
    "Can you build an ecommerce store?",
    "Do you provide SEO services?",
    "I need a quote for my project"
]

# ============================================================================
# LOCUST USER CLASS
# ============================================================================

class MCPUser(HttpUser):
    """
    Simulates a user interacting with the MCP server
    """
    wait_time = between(1, 3)  # Wait 1-3 seconds between tasks
    
    def on_start(self):
        """Called when a user starts"""
        self.user_id = f"user_{random.randint(1000, 9999)}"
        self.email = f"test{random.randint(1000, 9999)}@example.com"
    
    @task(5)  # Weight: 5 (most common)
    def test_chat(self):
        """Test chat endpoint"""
        message = random.choice(SAMPLE_CHAT_MESSAGES)
        
        with self.client.post(
            "/api/chat",
            json={"message": message, "user_id": self.user_id},
            catch_response=True
        ) as response:
            if response.status_code == 200:
                data = response.json()
                if "reply" in data or "error" in data:
                    response.success()
                else:
                    response.failure("Invalid response format")
            elif response.status_code == 429:
                # Rate limit is expected
                response.success()
            else:
                response.failure(f"Unexpected status: {response.status_code}")
    
    @task(3)  # Weight: 3
    def test_create_lead(self):
        """Test lead creation endpoint"""
        name = random.choice(SAMPLE_NAMES)
        message = random.choice(SAMPLE_MESSAGES)
        
        with self.client.post(
            "/api/create-lead",
            json={
                "name": name,
                "email": self.email,
                "message": message
            },
            catch_response=True
        ) as response:
            if response.status_code == 200:
                data = response.json()
                if "status" in data or "error" in data:
                    response.success()
                else:
                    response.failure("Invalid response format")
            elif response.status_code == 429:
                response.success()
            else:
                response.failure(f"Unexpected status: {response.status_code}")
    
    @task(2)  # Weight: 2
    def test_calculate_quote(self):
        """Test quote calculation endpoint"""
        services = random.choice([
            "web,seo",
            "ecommerce,design",
            "web,seo,design",
            "ecommerce"
        ])
        
        with self.client.post(
            "/api/calculate-quote",
            json={
                "services": services,
                "requirements": "Standard features"
            },
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            elif response.status_code == 429:
                response.success()
            else:
                response.failure(f"Unexpected status: {response.status_code}")
    
    @task(1)  # Weight: 1 (least common, strict rate limit)
    def test_payment_link(self):
        """Test payment link generation (strict rate limit)"""
        with self.client.post(
            "/api/generate-payment-link",
            json={
                "client_name": "Test Client",
                "client_email": self.email,
                "amount": random.randint(10000, 100000),
                "description": "Test payment"
            },
            catch_response=True
        ) as response:
            if response.status_code == 200:
                data = response.json()
                if "payment_link" in data or "error" in data:
                    response.success()
                else:
                    response.failure("Invalid response format")
            elif response.status_code == 429:
                # Rate limit expected for payment endpoint
                response.success()
            else:
                response.failure(f"Unexpected status: {response.status_code}")
    
    @task(1)
    def test_health_check(self):
        """Test health check endpoint"""
        with self.client.get("/health", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Health check failed: {response.status_code}")


# ============================================================================
# CUSTOM EVENTS
# ============================================================================

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Called when test starts"""
    print("\n" + "="*60)
    print("🚀 LOAD TEST STARTING")
    print("="*60)
    print(f"Target: {environment.host}")
    print("="*60 + "\n")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Called when test stops"""
    print("\n" + "="*60)
    print("📊 LOAD TEST COMPLETED")
    print("="*60)
    
    stats = environment.stats
    
    print(f"\nTotal Requests: {stats.total.num_requests}")
    print(f"Total Failures: {stats.total.num_failures}")
    print(f"Average Response Time: {stats.total.avg_response_time:.2f}ms")
    print(f"Max Response Time: {stats.total.max_response_time:.2f}ms")
    print(f"Requests/sec: {stats.total.total_rps:.2f}")
    
    if stats.total.num_failures > 0:
        failure_rate = (stats.total.num_failures / stats.total.num_requests) * 100
        print(f"Failure Rate: {failure_rate:.2f}%")
    
    print("\nEndpoint Statistics:")
    for name, stat in stats.entries.items():
        if stat.num_requests > 0:
            print(f"\n{name}:")
            print(f"  Requests: {stat.num_requests}")
            print(f"  Failures: {stat.num_failures}")
            print(f"  Avg Response: {stat.avg_response_time:.2f}ms")
            print(f"  Max Response: {stat.max_response_time:.2f}ms")
    
    print("\n" + "="*60 + "\n")


# ============================================================================
# USAGE
# ============================================================================

"""
RUN LOAD TESTS:

# Basic test (10 users)
locust -f locustfile.py --host=http://localhost:8000 --users 10 --spawn-rate 2

# Stress test (200 users)
locust -f locustfile.py --host=http://localhost:8000 --users 200 --spawn-rate 20

# With web UI
locust -f locustfile.py --host=http://localhost:8000

# Headless mode (10 min test)
locust -f locustfile.py --host=http://localhost:8000 --users 100 --spawn-rate 10 --run-time 10m --headless

WHAT TO MONITOR:
- CPU usage (should stay < 80%)
- Memory usage (should not grow continuously)
- Response times (should stay < 1000ms)
- Error rate (should stay < 1%)
- Rate limiting (should work correctly)

PASS CRITERIA:
✅ 200 concurrent users stable for 10 minutes
✅ Average response time < 500ms
✅ Error rate < 1%
✅ No memory leaks
✅ Rate limiting working
✅ Circuit breakers working
"""

print("✅ Locust Load Test Configuration Loaded")
print("\nRun with:")
print("  locust -f locustfile.py --host=http://localhost:8000")
print("\nOr headless:")
print("  locust -f locustfile.py --host=http://localhost:8000 --users 200 --spawn-rate 20 --run-time 10m --headless")
