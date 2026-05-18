#!/usr/bin/env python3
"""Simple test script for MCP server tools"""

import json

def test_direct_import():
    """Test by importing the server module directly"""
    print("\n🧪 Testing tools by direct import...")
    print("-" * 50)
    
    import sys
    import os
    sys.path.insert(0, os.path.dirname(__file__))
    
    # Load environment variables
    from pathlib import Path
    env_file = Path(__file__).parent / ".env"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
    
    from server import search, fetch, create_lead, load_docs
    
    # Test 1: Load docs
    print("\n1. Loading site index...")
    docs = load_docs()
    print(f"   ✓ Loaded {len(docs)} documents")
    if docs:
        print(f"   Sample: {docs[0].get('title', 'N/A')}")
    
    # Test 2: Search
    print("\n2. Testing search('services')...")
    result = search("services")
    data = json.loads(result['content'][0]['text'])
    print(f"   ✓ Found {len(data.get('results', []))} results")
    for r in data.get('results', [])[:3]:
        print(f"   - {r['title']} ({r['url']})")
    
    # Test 3: Fetch
    if data.get('results'):
        doc_id = data['results'][0]['id']
        print(f"\n3. Testing fetch('{doc_id}')...")
        result = fetch(doc_id)
        doc = json.loads(result['content'][0]['text'])
        if 'error' not in doc:
            print(f"   ✓ Fetched: {doc.get('title', 'N/A')}")
            print(f"   Text preview: {doc.get('text', '')[:100]}...")
        else:
            print(f"   ✗ Error: {doc['error']}")
    
    # Test 4: Create lead
    print("\n4. Testing create_lead()...")
    result = create_lead(
        name="Test User",
        email="test@example.com",
        message="This is a test lead"
    )
    lead_data = json.loads(result['content'][0]['text'])
    print(f"   ✓ Status: {lead_data.get('status')}")
    print(f"   Email sent: {lead_data.get('emailed')}")
    
    print("\n" + "=" * 50)
    print("✅ All tests completed!")
    print("=" * 50)

if __name__ == "__main__":
    print("=" * 50)
    print("MCP Server Test Suite")
    print("=" * 50)
    
    test_direct_import()
