# moz-demog-api

## Introdução

moz-demog-api é uma API pública RESTful que fornece dados demográficos de Moçambique entre 2017 e 2026, em formato JSON

Ela é destinada a desenvolvedores, estudantes de programação, cientistas de dados e qualquer pessoa com habilidades técnicas necessárias para o seu uso.

Todos os dados foram adquiridos através dos recursos disponibilizados no site oficial do Instituto Nacional de Estatística (INE).


## Endpoints (pontos de acesso da api)

No momento, a API está hospedada em um serviço gratuito e com limitações.
A URL base é: https://moz-demog-api.onrender.com/api.

Os endpoints disponíveis são:

### GET country info
> Retorna dados em JSON com informações básicas do país, no ano corrente.

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/country
```
#### resposta:
```js
[
    {
        "id": 1,
        "capital_city": "Maputo",
        "official_language": "Portuguese",
        "independence_date": "1975-06-25T00:00:00.000Z",
        "total_area_sqkm": 799380,
        "head_of_state": "Daniel Francisco Chapo"
    }
]
```
### GET country/all
> Retorna todas as informações do país disponíveis, para todos os anos.

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
                    {
                        "year": 2017,

                    //mais dados abaixo
```

### GET country/:ano
> Retorna todas as informações do país disponíveis, filtrando por ano específico.
#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/country/2025
```
#### resposta:
```js
[
    {
        "info": {
            "country_info": {
                "country_data": [
                    {
                        "year": 2025,
                        "head_of_state": "Daniel Francisco Chapo",
                        "id": 1,
                        "capital_city": "Maputo",
                        "official_language": "Portuguese",
                        "independence_date": "1975-06-25",
                        "total_area_sqkm": 799380
                    }
                ],
                "list_of_provinces": [

                    //mais dados abaixo
```

### GET provinces
> Retorna dados populacionais categorizados por província. Os dados disponibilizados para as províncias são atualmente apenas para o ano de 2023.

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/provinces
```
#### resposta:
```js
[
    {
        "province_data": [
            {
                "province_name": "Niassa",
                "population_per_1000hab": {
                    "id": 1,
                    "per_thousand_male": 1072,
                    "per_thousand_female": 1131,
                    "per_thousand_total": 2203,
                    "province_id": 1
                },
                "population_percentual_structure": {
                    //mais dados abaixo
```

### GET provinces/:nome
> Retorna dados populacionais disponibilizados para a província, no ano de 2023, filtrando a província pelo nome.
> O nome da província deve iniciar com letra maiúscula (ex. Maputo). Se o nome contiver espaços, respeite-os (ex. Cabo Delgado, Cidade de Maputo).

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/provinces/Cidade de Maputo
```
#### resposta:
```js
[
    {
        "province_data": [
            {
                "province_name": "Cidade de Maputo",
                "population_per_1000hab": {
                    "id": 11,
                    "per_thousand_male": 551,
                    "per_thousand_female": 582,
                    "per_thousand_total": 1133,
                    "province_id": 11
                },
                    //mais dados abaixo
```

### GET provinces/:name/percentual-structure
> Retorna a estrutura percentual da população de certa província.

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/provinces/Maputo/percentual-structure
```
#### resposta:
```js
[
    {
        "province_data": [
            {
                "province_name": "Cidade de Maputo",
                "population_percentual_structure": {
                    "id": 11,
                    "male_population": 3.5,
                    "female_population": 3.5,
                    "total": 3.5,
                    "province_id": 11
                }
            }
        ]
    }
]
```

### GET provinces/:name/per-thousand
> Retorna a população da província por 1000 habitantes.

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/provinces/Maputo/per-thousand
```
#### resposta:
```js
[
    {
        "province_data": [
            {
                "province_name": "Cidade de Maputo",
                "population_percentual_structure": {
                    "id": 11,
                    "male_population": 3.5,
                    "female_population": 3.5,
                    "total": 3.5,
                    "province_id": 11
                }
            }
        ]
    }
]
```

### GET provinces/year/:ano
> Retorna todos os dados de todas as províncias para um ano específico.

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/provinces/year/2023
```
#### resposta:
```js
[
    {
        "province_data": [
            {
                "year": 2023,
                "province_name": "Niassa",
                "population_per_1000hab": {
                    "id": 1,
                    "per_thousand_male": 1072,
                    "per_thousand_female": 1131,
                    "per_thousand_total": 2203,
                    "province_id": 1
                },
                "population_percentual_structure": {
                    // mais dados abaixo
```


### GET provinces/years
> Retorna todos os anos com registros populacionais de províncias.

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/provinces/years
```
#### resposta:
```js
[
    {
        "year": 2023
    }
]
```

### GET indicators
> Retorna indicadores populacionais de todo o país, para os anos entre 2017 e 2026 (inclusive).

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/indicators
```
#### resposta:
```js

        "info": {
            "indicators": [
                {
                    "year": 2023,
                    "indicators_for_year": {
                        "populational_indicators": {
                            "id": 1,
                            "total_population": 32420,
                            "male_population": 15684,
                            "female_population": 16736,
                            "urban_percentual": 34.7,
                            "sex_ratio": 93.7,
                            "gross_mortality_rate": 11.7,
                            "gross_birth_rate": 36.7,
                            "growth_rate": 2.5,
                            "year_id": 1,
                            "median_age": 17.5

                            //mais dados abaixo
```

### GET indicators/:ano
> Retorna indicadores populacionais do país, para um ano específico.

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/indicators/2023
```
#### resposta:
```js
[
    {
        "info": {
            "indicators": [
                {
                    "year": 2023,
                    "indicators_for_year": {
                        "populational_indicators": {
                            "id": 1,
                            "total_population": 32420,
                            "male_population": 15684,
                            "female_population": 16736,

                           // mais dados abaixo

```

### GET indicators/dependency-rate
> Retorna o índice de dependência da população para todos os anos registrados.

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/indicators/dependency-rate
```
#### resposta:
```js
{
    "dependency_rate": [
        {
            "year": 2023,
            "indicators": {
                "year_id": 1,
                "total": 91.5,
                "young": 85
            }
        },
        {
            "year": 2017,
            "indicators": {
                "year_id": 2,
                "total": 99.6,
                "young": 93.1

        // mais dados abaixo
```

### GET indicators/dependency-rate/:ano
> Retorna o índice de dependência da população para um ano específico.

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/indicators/dependency-rate/2023
```
#### resposta:
```js
{
    "dependency_rate": [
        {
            "year": 2023,
            "indicators": {
                "year_id": 1,
                "total": 91.5,
                "young": 85
        // mais dados abaixo
```
### GET indicators/life-expectancy
> Retorna a expectativa de vida em anos ao nascer, para todos os anos registrados.

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/indicators/life-expectancy
```
#### resposta:
```js
[
    {
        "life_expectancy": [
            {
                "year": 2023,
                "life-expectancy": {
                    "year_id": 1,
                    "male_life_expectancy": 53.2,
                    "female_life_expectancy": 59.1,
                    "average_life_expectancy": 56.1
                }
            },
            {
                "year": 2017,
        // mais dados abaixo
```

### GET indicators/life-expectancy/:ano
> Retorna a expectativa de vida ao nascer, para um ano específico.

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/indicators/life-expectancy/2024
```
#### resposta:
```js
[
    {
        "life_expectancy": [
            {
                "year": 2024,
                "life-expectancy": {
                    "year_id": 8,
                    "male_life_expectancy": 54,
                    "female_life_expectancy": 59.5,
                    "average_life_expectancy": 56.5
                }
            }
        ]
    }
]
```


### GET indicators/infant-mortality
> Retorna a taxa de mortalidade infantil para todos os anos disponíveis.

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/indicators/infant-mortality
```
#### resposta:
```js
{
    "data": [
        {
            "infant_mortality": [
                {
                    "year": 2023,
                    "infant_mortality": {
                        "year_id": 1,
                        "average_infant_mortality": 63.9,
                        "male_infant_mortality": 66,
                        "female_infant_mortality": 61.8
                    }
                },
                {
                    "year": 2017,
                    "infant_mortality": {
                        // mais dados abaixo
```

### GET indicators/infant-mortality/:ano
> Retorna a taxa de mortalidade infantil para um ano específico.

#### exemplo de requisicao:
```curl
GET  https://moz-demog-api.onrender.com/api/indicators/infant-mortality/2025
```
#### resposta:
```js
{
    "data": [
        {
            "infant_mortality": [
                {
                    "year": 2025,
                    "infant_mortality": {
                        "year_id": 9,
                        "average_infant_mortality": 61.7,
                        "male_infant_mortality": 63.7,
                        "female_infant_mortality": 59.7
                    }
                }
            ]
        }
    ]
}
```

___

## Nota importante:
> Os dados disponíveis estão categorizados como observados e projetados. No momento, todos os dados de 2017 a 2023 são observados, e os de 2024 a 2026 são dados projetados.
