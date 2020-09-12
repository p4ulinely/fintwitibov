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
- List of Stop-words, in pt-BR, to add to the pre-processing step.
- Initial module to manage the NLP
    - Method to convert lib Onto-PT into object.
    - Method to return the word polarizations.  
    - Method to return the polarization of an entire phrase/tweet.
    - Endpoint to return sentiment of the day and its tokens.
- Endpoint to display tweets intensity, tweets sentiments and INDFUT historical data.

## To Do

- Endpoint to display tokens and its frequencies
    - Break down current SentimentosPalavras Model in two: SentimetoDia and TokensEFrequencias.
    - Change the geraSentimentosSeteDia Controller, in order to feed SentimetoDia and TokensEFrequencias Models.
    - Change/Adapt all Controllers that use SentimentosPalavras models.
- Allow mostrarDadosHistoricosMaisSentimentosMaisIntensidadesTweets Endpoint to filter by date.
- Websocket to watch tweets, from either one or many profiles, then store them.
