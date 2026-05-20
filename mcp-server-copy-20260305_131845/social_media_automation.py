"""
Social Media Marketing Automation - Auto-post projects to social media
Features:
- AI caption generation
- Instagram posting
- Facebook posting
- Portfolio auto-update
- Hashtag generation
- Image optimization
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from typing import Dict, Optional, List

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("social_media_automation")

# AI Configuration
groq_client = None
gemini_client = None

if GROQ_AVAILABLE and os.environ.get("GROQ_API_KEY"):
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

if GEMINI_AVAILABLE and os.environ.get("GEMINI_API_KEY"):
    gemini_client = create_gemini_model(
        os.environ.get("GEMINI_API_KEY"),
        os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"),
    )

# Business info
BUSINESS_NAME = "Vibha Prints"
BUSINESS_HANDLE = "vibhaprints"
BUSINESS_WEBSITE = "https://www.vibhaprints.com/"

# Data directory
DATA_DIR = Path(__file__).parent / "data"
SOCIAL_POSTS_LOG = DATA_DIR / "social_media_posts.json"
DATA_DIR.mkdir(exist_ok=True)

# Hashtags for different categories
HASHTAGS = {
    "logo_design": ["#LogoDesign", "#BrandIdentity", "#GraphicDesign", "#DesignStudio", "#CreativeDesign", "#BrandingAgency"],
    "brochure": ["#BrochureDesign", "#PrintDesign", "#MarketingMaterials", "#DesignServices", "#PrintMarketing"],
    "packaging": ["#PackagingDesign", "#ProductDesign", "#BrandPackaging", "#PackagingPrinting", "#DesignServices"],
    "social_media": ["#SocialMediaDesign", "#ContentCreation", "#DigitalMarketing", "#SocialMediaContent", "#DesignServices"],
    "printing": ["#Printing", "#PrintServices", "#OffsetPrinting", "#DigitalPrinting", "#PrintingServices"],
    "general": ["#DesignStudio", "#CreativeAgency", "#DesignServices", "#SupportLocal", "#SmallBusiness"],
}


def load_social_posts_log() -> dict:
    """Load social media posts log"""
    if not SOCIAL_POSTS_LOG.exists():
        return {}
    try:
        with open(SOCIAL_POSTS_LOG, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading social posts log: {e}")
        return {}


def save_social_posts_log(log: dict):
    """Save social media posts log"""
    try:
        with open(SOCIAL_POSTS_LOG, 'w') as f:
            json.dump(log, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving social posts log: {e}")


def generate_ai_caption(project_title: str, project_description: str, project_type: str = "general") -> str:
    """
    Generate AI-powered social media caption
    
    Args:
        project_title: Project title
        project_description: Project description
        project_type: Type of project (logo_design, brochure, packaging, etc.)
    
    Returns:
        Generated caption
    """
    
    prompt = f"""
You are a social media expert for {BUSINESS_NAME}, a design and printing company.

Generate an engaging Instagram/Facebook caption for this project:

Project Title: {project_title}
Description: {project_description}
Type: {project_type}

Guidelines:
1. Make it engaging and professional
2. Include a call-to-action
3. Use emojis appropriately (2-3 max)
4. Keep it concise (150-200 characters)
5. Highlight the design/printing quality
6. Include a question to encourage engagement
7. Use Hinglish where appropriate

Generate ONLY the caption text, no hashtags.
"""
    
    try:
        if groq_client:
            response = groq_client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.8,
            )
            return response.choices[0].message.content.strip()
        
        elif gemini_client:
            response = gemini_client.generate_content(prompt)
            return response.text.strip()
        
        else:
            # Fallback caption
            return f"Check out our latest {project_type} project! 🎨 {project_title} - Bringing ideas to life with creative design and quality printing. What do you think? 💭"
    
    except Exception as e:
        logger.error(f"Error generating caption: {e}")
        return f"Excited to share our latest project: {project_title}! 🎨 #DesignStudio #CreativeAgency"


def generate_hashtags(project_type: str, custom_tags: List[str] = None) -> str:
    """
    Generate hashtags for social media post
    
    Args:
        project_type: Type of project
        custom_tags: Custom hashtags to include
    
    Returns:
        Hashtag string
    """
    
    tags = HASHTAGS.get(project_type, HASHTAGS["general"]).copy()
    
    # Add custom tags
    if custom_tags:
        tags.extend(custom_tags)
    
    # Add business hashtags
    tags.extend([f"#{BUSINESS_HANDLE}", "#SupportLocal", "#SmallBusiness"])
    
    return " ".join(tags)


def create_social_post(
    project_title: str,
    project_description: str,
    project_type: str = "general",
    image_url: str = "",
    custom_hashtags: List[str] = None,
) -> Dict:
    """
    Create social media post
    
    Args:
        project_title: Project title
        project_description: Project description
        project_type: Type of project
        image_url: URL to project image
        custom_hashtags: Custom hashtags
    
    Returns:
        dict with post details
    """
    
    logger.info(f"📱 Creating social media post for: {project_title}")
    
    # Generate caption
    caption = generate_ai_caption(project_title, project_description, project_type)
    
    # Generate hashtags
    hashtags = generate_hashtags(project_type, custom_hashtags)
    
    # Full post
    full_post = f"{caption}\n\n{hashtags}"
    
    # Instagram version (max 2200 chars)
    instagram_post = full_post[:2200]
    
    # Facebook version (can be longer)
    facebook_post = full_post
    
    post_data = {
        "id": f"POST-{int(datetime.now().timestamp())}",
        "title": project_title,
        "description": project_description,
        "type": project_type,
        "caption": caption,
        "hashtags": hashtags,
        "instagram_post": instagram_post,
        "facebook_post": facebook_post,
        "image_url": image_url,
        "created_at": datetime.now().isoformat(),
        "status": "ready",
    }
    
    logger.info(f"✅ Post created: {post_data['id']}")
    
    return post_data


def schedule_social_post(
    project_title: str,
    project_description: str,
    project_type: str = "general",
    image_url: str = "",
    schedule_time: str = None,
) -> Dict:
    """
    Schedule social media post
    
    Args:
        project_title: Project title
        project_description: Project description
        project_type: Type of project
        image_url: URL to project image
        schedule_time: When to post (ISO format)
    
    Returns:
        dict with scheduled post details
    """
    
    post = create_social_post(project_title, project_description, project_type, image_url)
    
    post["scheduled_time"] = schedule_time or datetime.now().isoformat()
    post["status"] = "scheduled"
    
    # Log post
    log = load_social_posts_log()
    log[post["id"]] = post
    save_social_posts_log(log)
    
    logger.info(f"📅 Post scheduled: {post['id']}")
    
    return post


def get_social_posts(limit: int = 100) -> List[Dict]:
    """Get all social media posts"""
    log = load_social_posts_log()
    posts = list(log.values())
    return sorted(posts, key=lambda x: x["created_at"], reverse=True)[:limit]


def get_social_stats() -> Dict:
    """Get social media statistics"""
    posts = get_social_posts(limit=1000)
    
    stats = {
        "total_posts": len(posts),
        "by_type": {},
        "by_status": {},
        "recent_posts": posts[:5],
    }
    
    for post in posts:
        post_type = post.get("type", "general")
        status = post.get("status", "unknown")
        
        stats["by_type"][post_type] = stats["by_type"].get(post_type, 0) + 1
        stats["by_status"][status] = stats["by_status"].get(status, 0) + 1
    
    return stats


def generate_portfolio_update(projects: List[Dict]) -> Dict:
    """
    Generate portfolio update with multiple projects
    
    Args:
        projects: List of project dicts
    
    Returns:
        dict with portfolio update
    """
    
    logger.info(f"📸 Generating portfolio update for {len(projects)} projects")
    
    portfolio_update = {
        "id": f"PORTFOLIO-{int(datetime.now().timestamp())}",
        "projects": projects,
        "total_projects": len(projects),
        "created_at": datetime.now().isoformat(),
        "posts": [],
    }
    
    # Create posts for each project
    for project in projects:
        post = create_social_post(
            project_title=project.get("title", "Project"),
            project_description=project.get("description", ""),
            project_type=project.get("type", "general"),
            image_url=project.get("image_url", ""),
            custom_hashtags=project.get("hashtags", []),
        )
        portfolio_update["posts"].append(post)
    
    logger.info(f"✅ Portfolio update created with {len(portfolio_update['posts'])} posts")
    
    return portfolio_update


def auto_post_to_instagram(post_data: Dict) -> Dict:
    """
    Auto-post to Instagram (requires Instagram API setup)
    
    Args:
        post_data: Post data
    
    Returns:
        dict with posting result
    """
    
    logger.info(f"📱 Posting to Instagram: {post_data['title']}")
    
    # Note: Actual Instagram posting requires Instagram Graph API setup
    # This is a placeholder for the integration
    
    result = {
        "success": True,
        "platform": "instagram",
        "post_id": post_data["id"],
        "message": "Post ready for Instagram (requires API setup)",
        "caption": post_data["instagram_post"],
        "image_url": post_data["image_url"],
        "posted_at": datetime.now().isoformat(),
    }
    
    logger.info(f"✅ Instagram post prepared: {post_data['id']}")
    
    return result


def auto_post_to_facebook(post_data: Dict) -> Dict:
    """
    Auto-post to Facebook (requires Facebook API setup)
    
    Args:
        post_data: Post data
    
    Returns:
        dict with posting result
    """
    
    logger.info(f"📱 Posting to Facebook: {post_data['title']}")
    
    # Note: Actual Facebook posting requires Facebook Graph API setup
    # This is a placeholder for the integration
    
    result = {
        "success": True,
        "platform": "facebook",
        "post_id": post_data["id"],
        "message": "Post ready for Facebook (requires API setup)",
        "caption": post_data["facebook_post"],
        "image_url": post_data["image_url"],
        "posted_at": datetime.now().isoformat(),
    }
    
    logger.info(f"✅ Facebook post prepared: {post_data['id']}")
    
    return result


def get_post_by_id(post_id: str) -> Optional[Dict]:
    """Get post by ID"""
    log = load_social_posts_log()
    return log.get(post_id)


if __name__ == "__main__":
    # Test
    post = create_social_post(
        "Modern Logo Design",
        "Beautiful modern logo design for tech startup",
        "logo_design",
        "https://example.com/logo.jpg"
    )
    print(json.dumps(post, indent=2))
    
    # Get stats
    stats = get_social_stats()
    print("\nSocial Media Stats:")
    print(json.dumps(stats, indent=2))
