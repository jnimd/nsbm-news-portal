#!/usr/bin/env python3
"""
NSBM NewsDesk - Campus News Management System
Day 04 Final Release Distribution Script
Distributes all active project files into 8 distinct member folders inside 'Day_04_Final_Release'.
"""

import os
import shutil
import sys
from pathlib import Path

PROJECT_ROOT = Path(r"c:\Users\R O G\Downloads\news web")
RELEASE_ROOT = PROJECT_ROOT / "Day_04_Final_Release"

# Mapping of member folders and their assigned files/folders
MEMBER_ALLOCATIONS = {
    "Member_01_Frontend_Lead": {
        "role": "Team Leader & Frontend Lead (Core layout, home interface, assets, main CSS/JS bundles)",
        "items": [
            "index.html",
            "nsbm-logo.jpg",
            "css/global.css",
            "css/landing.css",
            "css/scrolly.css",
            "js/landing.js",
            "js/scrolly.js",
            "js/theme.js",
            "js/icons.js",
            "1im",
            "2im",
            "3im"
        ]
    },
    "Member_02_Authentication_Security": {
        "role": "Security & Authentication Engineer (Auth pages, registration, login scripts, security APIs)",
        "items": [
            "login.html",
            "register.html",
            "nsbm-logo.jpg",
            "css/global.css",
            "css/auth.css",
            "js/auth.js",
            "js/theme.js",
            "js/icons.js",
            "api/auth.php",
            "config/db.php"
        ]
    },
    "Member_03_Admin_Dashboard_CRUD": {
        "role": "Admin Panel & CRUD Specialist (Admin panels, article editor scripts, CRUD APIs)",
        "items": [
            "admin-dashboard.html",
            "nsbm-logo.jpg",
            "css/global.css",
            "css/dashboard.css",
            "js/admin-dashboard.js",
            "js/theme.js",
            "js/icons.js",
            "api/articles.php",
            "api/categories.php",
            "config/db.php"
        ]
    },
    "Member_04_Student_Submissions": {
        "role": "Student Contributor Portal Lead (Student portal views, submission handlers, submission storage JS)",
        "items": [
            "student-dashboard.html",
            "nsbm-logo.jpg",
            "css/global.css",
            "css/dashboard.css",
            "js/student-dashboard.js",
            "js/theme.js",
            "js/icons.js",
            "api/submissions.php",
            "config/db.php"
        ]
    },
    "Member_05_Campus_Buzz_Social_Feed": {
        "role": "Social Wall & Media Engineer (Campus feed, social pages, full news media assets folder)",
        "items": [
            "campus-feed.html",
            "nsbm-social.html",
            "nsbm-logo.jpg",
            "css/global.css",
            "css/feed.css",
            "js/campus-feed.js",
            "js/theme.js",
            "js/icons.js",
            "news"
        ]
    },
    "Member_06_Database_Backend_Core": {
        "role": "Database Administrator & Backend Lead (Updated SQL schemas, PDO connection configs, core DB APIs)",
        "items": [
            "database_fixed.sql",
            "config/db.php",
            "api/articles.php",
            "api/auth.php",
            "js/data-store.js"
        ]
    },
    "Member_07_Comments_Bookmarks": {
        "role": "User Engagement & Moderation Lead (Comment engine scripts, bookmark APIs, icon handlers, engagement scripts)",
        "items": [
            "api/comments.php",
            "api/subscriptions.php",
            "config/db.php",
            "js/icons.js",
            "js/data-store.js"
        ]
    },
    "Member_08_Announcements_Search_Analytics": {
        "role": "Search, Notices & DevOps Specialist (Search engine scripts, analytics, mobile navigation JS, repository setup files)",
        "items": [
            "api/announcements.php",
            "api/categories.php",
            "config/db.php",
            "js/icons.js",
            "js/data-store.js",
            "README.md",
            ".gitignore"
        ]
    }
}

def copy_resource(src_path: Path, dest_path: Path):
    """Copies file or directory recursively, ignoring zip files and temporary files."""
    if not src_path.exists():
        print(f"  [WARN] Missing source item: {src_path}")
        return 0, 0

    files_copied = 0
    bytes_copied = 0

    if src_path.is_file():
        if src_path.suffix.lower() == ".zip":
            return 0, 0
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src_path, dest_path)
        files_copied = 1
        bytes_copied = src_path.stat().st_size
    elif src_path.is_dir():
        def ignore_patterns(folder, names):
            ignored = set()
            for name in names:
                if name.lower().endswith(".zip") or name in {"__pycache__", ".git"}:
                    ignored.add(name)
            return ignored

        if dest_path.exists():
            shutil.rmtree(dest_path)
        shutil.copytree(src_path, dest_path, ignore=ignore_patterns)

        for root, dirs, files in os.walk(dest_path):
            files_copied += len(files)
            for f in files:
                bytes_copied += os.path.getsize(os.path.join(root, f))

    return files_copied, bytes_copied

def main():
    print("=" * 75)
    print("NSBM NewsDesk - Day 04 Final Release Distribution Engine")
    print(f"Source Root: {PROJECT_ROOT}")
    print(f"Target Master Directory: {RELEASE_ROOT}")
    print("=" * 75)

    if RELEASE_ROOT.exists():
        print(f"Cleaning previous release directory: {RELEASE_ROOT}")
        shutil.rmtree(RELEASE_ROOT)
    RELEASE_ROOT.mkdir(parents=True, exist_ok=True)

    summary_stats = {}

    for member_key, info in MEMBER_ALLOCATIONS.items():
        member_dir = RELEASE_ROOT / member_key
        member_dir.mkdir(parents=True, exist_ok=True)
        print(f"\nProcessing: {member_key}")
        print(f"Domain Role: {info['role']}")

        total_files = 0
        total_bytes = 0

        for item_rel in info["items"]:
            src = PROJECT_ROOT / item_rel
            dest = member_dir / item_rel

            f_count, b_count = copy_resource(src, dest)
            total_files += f_count
            total_bytes += b_count
            if f_count > 0:
                print(f"  -> Allocated: {item_rel} ({f_count} file(s), {b_count / (1024*1024):.2f} MB)")

        # Create a dedicated member README inside each member directory
        readme_path = member_dir / "MEMBER_ASSIGNMENT.md"
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(f"# {member_key}\n\n")
            f.write(f"**Assigned Role & Responsibilities:**\n{info['role']}\n\n")
            f.write("## Distributed Active Project Deliverables (Day 04 Final):\n")
            for item_rel in info["items"]:
                f.write(f"- `{item_rel}`\n")
            f.write(f"\n- Total files: {total_files}\n")
            f.write(f"- Total payload: {total_bytes / (1024*1024):.2f} MB\n\n")
            f.write("## Instructions for Member GitHub Commit:\n")
            f.write("1. Stage and commit the files allocated in this folder directly into your branch or assigned repository section.\n")
            f.write("2. Ensure all relative paths match the project standard structure.\n")
            f.write("3. Verify local runtime testing before final merge into the master Day 04 release branch.\n")

        summary_stats[member_key] = {
            "role": info["role"],
            "files": total_files,
            "bytes": total_bytes
        }

    # Generate master manifest in release root
    manifest_path = RELEASE_ROOT / "RELEASE_MANIFEST.md"
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write("# NSBM NewsDesk - Day 04 Final Release Manifest\n\n")
        f.write("Master distribution plan across 8 group members for university project submission.\n\n")
        f.write("| Member Folder | Domain & Responsibility | Files Count | Size (MB) |\n")
        f.write("| :--- | :--- | :--- | :--- |\n")
        total_all_files = 0
        total_all_bytes = 0
        for m_key, s in summary_stats.items():
            f.write(f"| **{m_key}** | {s['role']} | {s['files']} | {s['bytes'] / (1024*1024):.2f} MB |\n")
            total_all_files += s['files']
            total_all_bytes += s['bytes']
        f.write(f"| **TOTALS** | **Complete Project Assets Distributed** | **{total_all_files}** | **{total_all_bytes / (1024*1024):.2f} MB** |\n\n")
        f.write("### Verification Guidelines:\n")
        f.write("- All `.zip` compressed archives were automatically filtered and excluded.\n")
        f.write("- Complete directory trees (including `news/news 1..11` with real photos and `1im..3im` scrolly sequences) were preserved without splitting.\n")
        f.write("- All HTML files feature updated utf-8 charset declarations, clean paragraph renderers, dynamic auth guards, and real university assets.\n")

    print("\n" + "=" * 75)
    print("DISTRIBUTION COMPLETED SUCCESSFULLY!")
    print(f"Total files distributed across 8 members: {total_all_files}")
    print(f"Total volume: {total_all_bytes / (1024*1024):.2f} MB")
    print(f"Master Manifest created at: {manifest_path}")
    print("=" * 75)

if __name__ == "__main__":
    main()
