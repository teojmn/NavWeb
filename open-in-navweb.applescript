#!/usr/bin/osascript

-- Script AppleScript pour ouvrir une URL dans NavWeb
-- Usage: osascript open-in-navweb.applescript "instagram.com"

on run argv
    if (count of argv) > 0 then
        set targetURL to item 1 of argv
    else
        set targetURL to "google.com"
    end if
    
    set navwebURL to "navweb://" & targetURL
    
    tell application "System Events"
        open location navwebURL
    end tell
end run
