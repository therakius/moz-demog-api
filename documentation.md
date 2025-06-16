# moz-demog-api

## Introducao

*moz-demog-api* é uma api publica que disponibiliza dados demograficos de mocambique, observados e projectados em formato Json.

Ela é destinada a desenviolvedores, estudantes de programacao, cientistas de dados e qualquer pessoa com habilidades tecnicas necessarias para o seu uso.

Por agora, os dados disponiveis sao dos anos variando de 2017 a 2026. todos os dados foram adquiridos atraves dos recursos disponibilizados site oficial do Instituto Nacional de Estatisticas (INE).


## Endpoints (pontos de chegada da api)

No momento, a API esta hospedada num servico gratuito e com limitacoes.
 a URL base é https://moz-demog-api.onrender.com/api.

Os endpoints disponiveis sao:

### GET country info
> retorna dados em json das informacoes basicas do pais, no ano corrente

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/country
```
#### resposta:
```js
{
    "data": [
        {
            "id": 1,
            "capital_city": "Maputo",
            "official_language": "Portuguese",
            "independence_date": "1975-06-25T00:00:00.000Z",
            "total_area_sqkm": 799380,
            "head_of_state": "Daniel Francisco Chapo"
        }
    ]
}
```
### GET country/all
> retorna todas as informacoes do pais disponiveis, para todos os anos.
#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/country/all
```
#### resposta:
```js
[
    {
        "data": {
            "country_info": {
                "country_data": [
                    {
                        "year": 2023,
                        "head_of_state": "Felipe Jacinto Nyusi",
                        "id": 1,
                        "capital_city": "Maputo",
                        "official_language": "Portuguese",
                        "independence_date": "1975-06-25",
                        "total_area_sqkm": 799380
                    },

                    //mais dados abaixo
```

### GET country/:year
> retorna todas as informacoes do pais disponiveis, filtrando por ano especifico.
#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/country/2025
```
#### resposta:
```js
[
    {
        "data": {
            "country_info": {
                "country_data": [
                    {
                        "year": 2023,
                        "head_of_state": "Felipe Jacinto Nyusi",
                        "id": 1,
                        "capital_city": "Maputo",
                        "official_language": "Portuguese",
                        "independence_date": "1975-06-25",
                        "total_area_sqkm": 799380
                    },

                    //mais dados abaixo
```




