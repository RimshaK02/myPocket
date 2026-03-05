
import re
import json
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any

def cow_id(query):
    query = query.lower()
    cow = re.search(r'\bcow\s*#?\s*(\d+)\b', query)
    cow_id = cow.group(1) if cow else None
    return cow_id
def issue(query: str) -> Dict[str, Any]:
    query = query.lower()
    issue_match = re.search(r'\b(is|was|has|looks|seems)\s+(.+?)(?:[,\.]|$)', query)
    issue = issue_match.group(2) if issue_match else None
    return issue
def action(query: str) -> Dict[str, Any]:
    query = query.lower()
    patterns = [
        r'\btask(?:\s+to|\s+for|\s+of|\s*:)?\s+(.+?)(?=\s+(and|assign|before|by|in|then|with|that|who)\b|[.,;]|$)',
        r'\b(?:needs|need|must|should)\s+(.+?)(?=\s+(cow|by|in|before)\b|[.,;]|$)',
        r'\b(recheck|re-check|rechecking)\b',
        r'\bcheck\s+(.+?)(?=\s+(after|by|in|before|on)\b|[.,;]|$)',
        r'\bassign\s+(.+?)(?=\s+(cow|of))\b']
    for p in patterns:
        action_match = re.search(p, query)
        if action_match:
            if p.startswith(r'\b(recheck'):
                return "recheck"

            if p.startswith(r'\bcheck'):
                return "check " + action_match.group(1).strip()

            return action_match.group(1).strip()
    return None
print(action('Check cow 233 in 2 hours'))
def time(query:str) -> Optional[str]:
    query = query.lower()
    time_match = re.search(r'\b(before|by)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b', query)
    if time_match:
        hour_str = time_match.group(2)  
        minute_str = time_match.group(3)
        am_pm = time_match.group(4) 
        hour = int(hour_str)
        minute = int(minute_str) if minute_str else 0

        if am_pm:
            if am_pm == 'pm' and hour != 12:
                hour += 12
            if am_pm == 'am' and hour == 12:
                hour = 0

        return f'{hour:02d}:{minute:02d}'
    time_match1 = re.search(r'\b(?:in|after)\s+(\d+)\s*(hour|hours|hr|hrs|minute|minutes|min|mins)\b', query)
    if time_match1:
        amount = int(time_match1.group(1))
        unit = time_match1.group(2)
        if unit.startswith ('h'):
            time = timedelta(hours = amount)
        else:
            time = timedelta(minutes = amount)
        
        future_time = datetime.now() + time
        
        return future_time.strftime('%H:%M')
    return None
print(time("Check cow 500 after 2 hours"))

def assign (query: str) -> Dict[str, Any]:
    query = query.lower()
    pattern = [
        r'\bto\s+([a-z]+)\s+by\b',
        r'assign(?: it)? to ([A-Za-z]+)'
    ]
    for p in pattern:
        assign_match = re.search(p, query)
        if assign_match:
            return assign_match.group(1) 
    return None
print(assign("Assign trimming of cow 345 to Chris by 2 pm"))
def parse_command(query: str) -> Dict[str, Any]:
    query = query.lower()
    return {
        'cow_id': cow_id(query),
        'action' : action(query),
        'issue' : issue(query),
        'time' : time(query),
        'assigned_to' : assign(query)
    }
if __name__ == '__main__':
    examples = [
'Cow 333 is limping, check back in 2 hours and assign it to Chris.',
'Cow 123 need trimming by 3 pm, assign to Chris.',
'Cow 500 has not moved, check cow 500 in 45 minutes.',
'Create a task to trim cow 123 in 3 hours and assign it to Chris.',
'Recheck cow 233 in 2 hours and assign it to John.',
'Cow 440 should get checked before 4 pm and assign to Emily.',
'Assign trimming of cow 345 to Chris by 2 pm.',
'Cow 212 must be milked by 6 pm and assign to Tom.',
'Cow 555 is coughing, check cow 555 before 2 pm.',
'Cow 812 looks injured, check in 30 minutes.',
'Make a task to clean pen 4 before 5 pm and assign it to David.',
'Cow 200 is not eating, recheck in 1 hour.',
'Cow 441 has low activity, check cow 441 after 2 hours.',
'Create a task to vaccinate cow 51 by 1 pm and assign to Sarah.',
'Cow 600 needs checking by 2 pm.',
'Cow 704 has diarrhea, check cow 704 in 1 hour.',
'Cow 390 is overheating, recheck ccow 390 in 3 hours.',
'Create a task to wash the water troughs in 30 minutes and assign it to Mark.',
'Cow 222 is slow walking, check cow 222 before 11 am.'
]
    for i in examples:
        print(parse_command(i))