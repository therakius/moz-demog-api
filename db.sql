CREATE TABLE IF NOT EXISTS public.year (
    id serial primary key,
    year integer,
    head_of_state text,
    data_state text
);

CREATE TABLE IF NOT EXISTS public.country_data (
    id serial primary key,
    capital_city text,
    official_language text,
    independence_date date,
    total_area_sqkm integer
);

CREATE TABLE IF NOT EXISTS public.provinces (
    id serial primary key,
    province_name text,
    population_density integer,
    area_in_sqkm integer,
    year_id integer,
    CONSTRAINT provinces_year_id_fkey FOREIGN KEY (year_id)
        REFERENCES public.year (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.population_percentual_structure (
    id serial primary key,
    male_population numeric(4,1),
    female_population numeric(4,1),
    total numeric(4,1),
    province_id integer,
    CONSTRAINT population_percentual_structure_province_id_fkey FOREIGN KEY (province_id)
        REFERENCES public.provinces (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.population_per_thousand (
    id serial primary key,
    per_thousand_male integer,
    per_thousand_female integer,
    per_thousand_total integer,
    province_id integer,
    CONSTRAINT population_per_thousand_province_id_fkey FOREIGN KEY (province_id)
        REFERENCES public.provinces (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.life_expectancy_at_birth (
    year_id integer primary key,
    male_life_expectancy numeric(3,1),
    female_life_expectancy numeric(3,1),
    average_life_expectancy numeric(3,1),
    CONSTRAINT life_expectancy_at_birth_year_id_fkey FOREIGN KEY (year_id)
        REFERENCES public.year (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.infant_mortality (
    year_id integer primary key,
    average_infant_mortality numeric(3,1),
    male_infant_mortality numeric(3,1),
    female_infant_mortality numeric(3,1),
    CONSTRAINT infant_mortality_year_id_fkey FOREIGN KEY (year_id)
        REFERENCES public.year (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.dependency_rate (
    year_id integer primary key,
    total numeric(3,1),
    young numeric(3,1),
    CONSTRAINT dependency_rate_year_id_fkey FOREIGN KEY (year_id)
        REFERENCES public.year (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.country_pop_indicators (
    id serial primary key,
    total_population numeric(7,1),
    male_population numeric(7,1),
    female_population numeric(6,1),
    urban_percentual numeric(3,1),
    sex_ratio numeric(3,1),
    gross_mortality_rate numeric(3,1),
    gross_birth_rate numeric(3,1),
    growth_rate numeric(3,1),
    year_id integer,
    median_age numeric(3,1),
    CONSTRAINT country_pop_indicators_year_id_fkey FOREIGN KEY (year_id)
        REFERENCES public.year (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);


INSERT INTO public.year (id, year, head_of_state, data_state) VALUES
(1, 2023, 'Felipe Jacinto Nyusi', 'observed'),
(2, 2017, 'Felipe Jacinto Nyusi', 'observed'),
(3, 2018, 'Felipe Jacinto Nyusi', 'observed'),
(4, 2019, 'Felipe Jacinto Nyusi', 'observed'),
(5, 2020, 'Felipe Jacinto Nyusi', 'observed'),
(6, 2021, 'Felipe Jacinto Nyusi', 'observed'),
(7, 2022, 'Felipe Jacinto Nyusi', 'observed'),
(8, 2024, 'Felipe Jacinto Nyusi', 'projected'),
(9, 2025, 'Daniel Francisco Chapo', 'projected'),
(10, 2026, 'Daniel Francisco Chapo', 'projected');

INSERT INTO public.provinces (id, province_name, population_density, area_in_sqkm, year_id) VALUES
(1, 'Niassa', 17, 129056, 1),
(2, 'Cabo Delgado', 33, 82625, 1),
(3, 'Nampula', 81, 81606, 1),
(4, 'Zambezia', 57, 105008, 1),
(5, 'Tete', 32, 100724, 1),
(6, 'Manica', 37, 61661, 1),
(7, 'Sofala', 39, 68018, 1),
(8, 'Inhambane', 23, 68815, 1),
(9, 'Gaza', 20, 75709, 1),
(10, 'Maputo', 95, 26058, 1),
(11, 'Cidade de Maputo', 3777, 300, 1);

INSERT INTO public.population_percentual_structure (id, male_population, female_population, total, province_id) VALUES
(1, 6.8, 6.8, 6.8, 1),
(2, 8.5, 8.4, 8.5, 2),
(3, 20.7, 20.4, 20.5, 3),
(4, 18.5, 18.6, 18.5, 4),
(5, 10.0, 9.6, 9.8, 5),
(6, 7.1, 7.1, 7.1, 6),
(7, 8.3, 8.2, 8.3, 7),
(8, 4.7, 5.0, 4.9, 8),
(9, 4.3, 4.8, 4.6, 9),
(10, 7.6, 7.7, 7.6, 10),
(11, 3.5, 3.5, 3.5, 11);

INSERT INTO public.population_per_thousand (id, per_thousand_male, per_thousand_female, per_thousand_total, province_id) VALUES
(1, 1072, 1131, 2203, 1),
(2, 1337, 1408, 2745, 2),
(3, 3242, 3408, 6550, 3),
(4, 2895, 3108, 6004, 4),
(5, 1564, 1610, 3174, 5),
(6, 1111, 1188, 2299, 6),
(7, 1304, 1371, 2675, 7),
(8, 736, 845, 1581, 8),
(9, 673, 803, 1477, 9),
(10, 1198, 1282, 2480, 10),
(11, 551, 582, 1133, 11);

INSERT INTO public.life_expectancy_at_birth (year_id, male_life_expectancy, female_life_expectancy, average_life_expectancy) VALUES
(1, 53.2, 59.1, 56.1),
(2, 51.0, 56.5, 53.7),
(3, 51.4, 56.9, 54.1),
(4, 51.7, 57.4, 54.5),
(5, 52.1, 57.8, 54.9),
(6, 52.5, 58.2, 55.3),
(7, 52.9, 58.9, 55.7),
(8, 54.0, 59.5, 56.5),
(9, 54.0, 59.9, 56.9),
(10, 54.3, 60.4, 57.3);

INSERT INTO public.infant_mortality (year_id, average_infant_mortality, male_infant_mortality, female_infant_mortality) VALUES
(1, 63.9, 66.0, 61.8),
(2, 70.9, 73.1, 68.7),
(3, 69.7, 71.9, 67.5),
(4, 68.6, 70.7, 66.3),
(5, 67.4, 69.5, 65.2),
(6, 66.2, 68.3, 64.1),
(7, 65.1, 67.1, 62.9),
(8, 62.8, 64.8, 60.7),
(9, 61.7, 63.7, 59.7),
(10, 60.6, 62.6, 58.6);

INSERT INTO public.dependency_rate (year_id, total, young) VALUES
(1, 91.5, 85.0),
(2, 99.6, 93.1),
(3, 98.7, 92.2),
(4, 97.8, 91.2),
(5, 96.7, 90.1),
(6, 95.3, 88.7),
(7, 93.7, 87.0),
(8, 89.4, 83.0),
(9, 87.4, 80.9),
(10, 85.3, 78.9);

INSERT INTO public.country_pop_indicators (id, total_population, male_population, female_population, urban_percentual, sex_ratio, gross_mortality_rate, gross_birth_rate, growth_rate, year_id, median_age) VALUES
(1, 32420.0, 15684.0, 16736.0, 34.7, 93.7, 11.7, 36.7, 2.5, 1, 17.5),
(2, 27864.0, 13395.0, 14469.0, 33.3, 92.6, 12.3, 38.6, 2.6, 2, 16.6),
(3, 28586.0, 13758.0, 14828.0, 33.6, 92.8, 12.5, 38.3, 2.6, 3, 16.7),
(4, 29318.0, 14125.0, 15193.0, 33.8, 93.0, 12.4, 37.9, 2.6, 4, 16.8),
(5, 30067.0, 14501.0, 15565.0, 34.0, 93.2, 12.3, 37.6, 2.5, 5, 17.0),
(6, 30832.0, 14886.0, 15946.0, 34.2, 93.4, 12.1, 37.2, 2.5, 6, 17.1),
(7, 31616.0, 15280.0, 16336.0, 34.5, 93.5, 11.9, 37.0, 2.5, 7, 17.3),
(8, 33244.0, 16098.0, 17146.0, 34.9, 93.9, 11.5, 36.5, 2.5, 8, 17.7),
(9, 34090.0, 16524.0, 17566.0, 35.0, 94.1, 11.3, 36.2, 2.5, 9, 17.8),
(10, 34959.0, 16961.0, 17998.0, 35.2, 94.2, 11.2, 36.0, 2.5, 10, 17.0);

create table public.country_data (    
    id serial primary key,
    capital_city text,
    official_language text,
    independence_date date,
    area_in_sqkm integer
);

select * from public.country_data;

INSERT INTO public.country_data (capital_city, official_language, independence_date, total_area_sqkm) 
VALUES ('Maputo', 'Portuguese', '1975-06-25', 799380)