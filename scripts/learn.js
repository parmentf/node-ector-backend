#!/usr/bin/env node

const fetch = require('node-fetch');

const subjects = ['Agent_conversationnel','Paris', 'Nancy'];

const urls = subjects
    .map(subject => `http://fr.dbpedia.org/sparql?query=select+*+%0D%0Awhere+%7B%0D%0A+%3Chttp%3A%2F%2Ffr.dbpedia.org%2Fresource%2F${subject}%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fabstract%3E+%3Fabstract+.%0D%0A+filter%28lang%28%3Fabstract%29+%3D+%27fr%27%29%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on`);

const getAbstract = url => fetch(url)
    .then(response => response.json())
    .then(json => json.results.bindings[0].abstract.value);

const teach = abstract => {
    console.log(`teach ${abstract}`);
    fetch(`http://localhost:5000/v1/learn/wikipedia/${abstract}`, { mode: 'cors' })
};

Promise
    .all(urls.map(getAbstract))
    .then(abstracts => {
        // console.log(abstracts)
        Promise
            .all(abstracts.map(teach))
            .then(() => console.log(`subjects learned: ${subjects}`));
    })