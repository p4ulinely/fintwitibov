# Project for **Sentiment Analysis** of Brazilian Fintwit

This project has the purpose of find out a trustworthy approach to make a sentiment analysis on the brazilian fintwit community. A lot of stuff is done live from my YouTube channel.

## Array of Twitter Profiles

```javascript
["cafecomferri", "albuquerque_af", "hbredda", "fernandocluiz",
    "josuenunes", "PabloSpyer", "quantzed", "MeninRibeiro",
    "ThiagoNigro", "helocruz", "FariaLimaElevat", "sf2invest"]
``` 

There are much more profiles to watch, but due to limitations on the data storing, these are the monitored profiles so far.

## Stack

- Main Layer
    - Node (Express)
    - NoSQL (MongoDB)

## Done

- Endpoints for:
    - Get tweets from Twitter API. Store them on NoSQL DB.
    - Display stored tweets from either all profiles or a specific one.
    - Tokenize tweet into JSON, with their respective frequencies.
    - Tweets (grouped by date).
    - Tweets intensity concatenated with INDFUT volatility, to feed webpage of charts.
- Module to tokenize tweets, filtering stop-words/chars, urls, then generate js object with tokens and their respective frequencies.
- Get live source of either IBOV or INDFUT historical data.
- Model to INDFUT historical data
    - Route to display these data
    - Mix these data - from DB, with the, already done, Tweets intensity.  
- Find library, in pt-BR, to do the sentiment analysis, or find a dictionary with sentiment polarization.
    - Get lib into array.
- List of Stop-words, in pt-BR, to add pre-processing step.

## To Do

- `(doing)` Integrate sentiment library to the project.
- Websocket to watch tweets from specific profile
	- Generate JSON of frequencies and store them.
- Create cloud of sentiments of last month, week and day VS IBOV volatility.
- Webpage to display Charts of tweets intensity VS IBOV volatility.
