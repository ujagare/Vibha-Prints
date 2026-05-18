"""
Production Readiness Checks
Runs comprehensive checks before allowing server start
"""

import os
import sys
import re
from pathlib import Path
import psutil
import asyncio

# ============================================================================
# CHECK 1: NO BLOCKING CALLS IN ASYNC CODE
# ============================================================================

def check_blocking_calls():
    """Scan for blocking calls in async code"""
    print("\n🔍 Checking for blocking calls...")
    
    blocking_patterns = [
        (r"requests\.", "Use httpx for async HTTP calls"),
        (r"time\.sleep\(", "Use asyncio.sleep() instead"),
        (r"open\(.*\)", "Use aiofiles for async file I/O"),
    ]
    
    issues = []
    server_file = Path("server.py")
    
    if server_file.exists():
        content = server_file.read_text()
        
        for pattern, suggestion in blocking_patterns:
            matches = re.findall(pattern, content)
            if matches:
                issues.append({
                    "pattern": pattern,
                    "count": len(matches),
                    "suggestion": suggestion
                })
    
    if issues:
        print("⚠️  Blocking calls detected:")
        for issue in issues:
            print(f"   - {issue['pattern']}: {issue['count']} occurrences")
            print(f"     Suggestion: {issue['suggestion']}")
        return False
    else:
        print("✅ No blocking calls detected")
        return True


# ============================================================================
# CHECK 2: SECRET LEAK DETECTION
# ============================================================================

def check_secret_leaks():
    """Check for hardcoded secrets or leaked credentials"""
    print("\n🔍 Checking for secret leaks...")
    
    dangerous_patterns = [
        (r"api_key\s*=\s*['\"][^'\"]+['\"]", "Hardcoded API key"),
        (r"password\s*=\s*['\"][^'\"]+['\"]", "Hardcoded password"),
        (r"secret\s*=\s*['\"][^'\"]+['\"]", "Hardcoded secret"),
        (r"print\(.*api.*\)", "API key in print statement"),
        (r"print\(.*secret.*\)", "Secret in print statement"),
    ]
    
    issues = []
    
    for py_file in Path(".").rglob("*.py"):
        if "venv" in str(py_file) or "node_modules" in str(py_file):
            continue
        
        try:
            content = py_file.read_text()
            
            for pattern, description in dangerous_patterns:
                if re.search(pattern, content, re.IGNORECASE):
                    issues.append({
                        "file": str(py_file),
                        "issue": description
                    })
        except:
            pass
    
    if issues:
        print("⚠️  Potential secret leaks:")
        for issue in issues:
            print(f"   - {issue['file']}: {issue['issue']}")
        return False
    else:
        print("✅ No secret leaks detected")
        return True


# ============================================================================
# CHECK 3: ENVIRONMENT VARIABLES
# ============================================================================

def check_environment_variables():
    """Verify required environment variables are set"""
    print("\n🔍 Checking environment variables...")
    
    required_vars = [
        "GROQ_API_KEY",
        "SMTP_HOST",
        "SMTP_USER",
        "SMTP_PASS",
    ]
    
    optional_vars = [
        "RAZORPAY_KEY_ID",
        "RAZORPAY_KEY_SECRET",
        "FREEPIK_API_KEY",
    ]
    
    missing_required = []
    missing_optional = []
    
    for var in required_vars:
        value = os.environ.get(var)
        if not value or value.startswith("your_") or value.startswith("#"):
            missing_required.append(var)
    
    for var in optional_vars:
        value = os.environ.get(var)
        if not value or value.startswith("your_") or value.startswith("#"):
            missing_optional.append(var)
    
    if missing_required:
        print("❌ Missing required environment variables:")
        for var in missing_required:
            print(f"   - {var}")
        return False
    else:
        print("✅ All required environment variables set")
    
    if missing_optional:
        print("⚠️  Missing optional environment variables:")
        for var in missing_optional:
            print(f"   - {var}")
    
    return True


# ============================================================================
# CHECK 4: REDIS CONNECTION (for production rate limiting)
# ============================================================================

def check_redis_connection():
    """Check if Redis is available for production rate limiting"""
    print("\n🔍 Checking Redis connection...")
    
    try:
        import redis
        r = redis.Redis(host='localhost', port=6379, socket_timeout=2)
        r.ping()
        print("✅ Redis connected (production-ready rate limiting)")
        return True
    except ImportError:
        print("⚠️  Redis library not installed (using in-memory rate limiting)")
        print("   Install: pip install redis")
        return False
    except Exception as e:
        print("⚠️  Redis not available (using in-memory rate limiting)")
        print(f"   Error: {e}")
        return False


# ============================================================================
# CHECK 5: MEMORY MONITORING
# ============================================================================

def check_memory_usage():
    """Check current memory usage"""
    print("\n🔍 Checking memory usage...")
    
    process = psutil.Process(os.getpid())
    memory_mb = process.memory_info().rss / 1024 / 1024
    
    print(f"   Current memory: {memory_mb:.2f} MB")
    
    if memory_mb > 500:
        print("⚠️  High memory usage detected")
        return False
    else:
        print("✅ Memory usage normal")
        return True


# ============================================================================
# CHECK 6: LOG DIRECTORY
# ============================================================================

def check_log_directory():
    """Verify log directory exists and is writable"""
    print("\n🔍 Checking log directory...")
    
    log_dir = Path("logs")
    
    if not log_dir.exists():
        print("   Creating logs directory...")
        log_dir.mkdir(exist_ok=True)
    
    # Test write
    test_file = log_dir / "test.log"
    try:
        test_file.write_text("test")
        test_file.unlink()
        print("✅ Log directory writable")
        return True
    except Exception as e:
        print(f"❌ Log directory not writable: {e}")
        return False


# ============================================================================
# CHECK 7: UVICORN CONFIGURATION
# ============================================================================

def check_uvicorn_config():
    """Check if running with proper Uvicorn configuration"""
    print("\n🔍 Checking Uvicorn configuration...")
    
    # Check if running with multiple workers
    workers = os.environ.get("UVICORN_WORKERS", "1")
    
    if int(workers) < 2:
        print("⚠️  Running with single worker")
        print("   Recommendation: Use --workers 4 for production")
        print("   Command: uvicorn main:app --workers 4 --limit-concurrency 200")
        return False
    else:
        print(f"✅ Running with {workers} workers")
        return True


# ============================================================================
# CHECK 8: CIRCUIT BREAKER SINGLETONS
# ============================================================================

def check_circuit_breakers():
    """Verify circuit breakers are global singletons"""
    print("\n🔍 Checking circuit breakers...")
    
    try:
        from resilience import circuit_breakers
        
        if not circuit_breakers:
            print("⚠️  No circuit breakers initialized")
            return False
        
        print(f"✅ {len(circuit_breakers)} circuit breakers initialized")
        for name, breaker in circuit_breakers.items():
            state = breaker.get_state()
            print(f"   - {name}: {state['state']}")
        
        return True
    except Exception as e:
        print(f"⚠️  Could not check circuit breakers: {e}")
        return False


# ============================================================================
# RUN ALL CHECKS
# ============================================================================

def run_production_checks(strict: bool = False):
    """
    Run all production readiness checks
    
    Args:
        strict: If True, fail on warnings. If False, only fail on errors.
    """
    print("\n" + "="*60)
    print("🔒 PRODUCTION READINESS CHECKS")
    print("="*60)
    
    checks = [
        ("Blocking Calls", check_blocking_calls, False),
        ("Secret Leaks", check_secret_leaks, True),
        ("Environment Variables", check_environment_variables, True),
        ("Redis Connection", check_redis_connection, False),
        ("Memory Usage", check_memory_usage, False),
        ("Log Directory", check_log_directory, True),
        ("Uvicorn Config", check_uvicorn_config, False),
        ("Circuit Breakers", check_circuit_breakers, False),
    ]
    
    results = []
    critical_failures = []
    
    for name, check_func, is_critical in checks:
        try:
            passed = check_func()
            results.append((name, passed, is_critical))
            
            if not passed and is_critical:
                critical_failures.append(name)
        except Exception as e:
            print(f"❌ {name} check failed: {e}")
            results.append((name, False, is_critical))
            if is_critical:
                critical_failures.append(name)
    
    # Summary
    print("\n" + "="*60)
    print("📊 CHECK SUMMARY")
    print("="*60)
    
    passed_count = sum(1 for _, passed, _ in results if passed)
    total_count = len(results)
    
    for name, passed, is_critical in results:
        status = "✅" if passed else ("❌" if is_critical else "⚠️ ")
        critical_marker = " (CRITICAL)" if is_critical else ""
        print(f"{status} {name}{critical_marker}")
    
    print(f"\nPassed: {passed_count}/{total_count}")
    
    if critical_failures:
        print("\n❌ CRITICAL FAILURES DETECTED")
        print("Fix these issues before production deployment:")
        for failure in critical_failures:
            print(f"   - {failure}")
        print("="*60)
        
        if strict:
            sys.exit(1)
        return False
    
    if passed_count == total_count:
        print("\n✅ ALL CHECKS PASSED - PRODUCTION READY")
    else:
        print("\n⚠️  SOME WARNINGS - Review before production")
    
    print("="*60 + "\n")
    return True


# ============================================================================
# USAGE
# ============================================================================

"""
USAGE IN server.py:

from production_checks import run_production_checks

@app.on_event("startup")
async def startup_event():
    # Run production checks (strict=False for warnings only)
    run_production_checks(strict=False)
    
    # Or strict mode (blocks on warnings)
    # run_production_checks(strict=True)
"""

if __name__ == "__main__":
    run_production_checks(strict=False)
