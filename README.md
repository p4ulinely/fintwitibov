# Project for **Sentiment Analysis** of Brazilian Fintwit

This project has the purpose of find out a trustworthy approach to make a sentiment analysis on the brazilian fintwit community. A lot of stuff is done live from my YouTube channel.

## Array of Twitter Profiles

```javascript
"cafecomferri", "albuquerque_af", "hbredda", "fernandocluiz", "josuenunes", "PabloSpyer", "quantzed", "MeninRibeiro", "ThiagoNigro", "helocruz"
``` 

There are much more profiles to watch, but due to limitations on the data storing, these are the monitored profiles so far.

## Stack

- Main Layer
    - Node Express
    - NoSQL MongoDB

## Done

- Endpoints for:
    - Get tweets from Twitter API. Store them on NoSQL DB.
    - Display stored tweets from either all profiles or a specific one.
    - Tokenize tweet into JSON, with their respective frequencies.

- Module to tokenize tweets, filtering stop-words/chars, urls, then generate js object with tokens and their respective frequencies.

## To Do

- Endpoint of frequencies to feed Websocket
- Webpage to display a chart of Tweets intensity VS IBOV volatility.
- Websocket to watch tweets from specific profile
	- Generate JSON of frequencies and store them.
- Find library, in pt-BR, to do the sentiment analysis, or find a dictionary with sentiment polarization.
- Create live cloud of sentiments of last month, week and day.
