-- Creating tables:
create table year (    
    id serial primary key,
    name integer,
    head_of_state text
);

create table country_data (    
    id serial primary key,
    capital_city text,
    official_language text,
    independence_date date,
    area_in_sqkm integer
);

create table provinces (
    id serial primary key,
    province_name text,
    population_density integer,
    area_in_sqkm integer,
    year_id integer,
    foreign key (year_id) references year(id)
);

create table population_per_thousand(
    id serial primary key,
    male_population integer,
    female_population integer,
    total integer,
    province_id integer,
    foreign key (province_id) references provinces(id)
);

create table population_percentual_structure(
    id serial primary key,
    male_population numeric(4, 1),
    female_population numeric (4, 1),
    total numeric (4, 1),
    province_id integer,
    foreign key (province_id) references provinces(id)
);

create table country_pop_indicators(
    id serial primary key,
    total numeric(7,1),
    male numeric(7,1),
    female numeric (6,1),
    urban_percentual numeric (3,1),
    sex_ratio numeric(3,1),
    gross_mortality_rate numeric (3,1),
    gross_birth_rate numeric (3,1),
    growth_rate numeric (3,1),
    year_id integer,
    foreign key (year_id) references year(id)
);

create table dependency_rate (
    year_id integer primary key references year(id),
    total numeric (3,1),
    young numeric (3,1)
);

create table life_expectancy_at_birth(
    year_id integer primary key references year(id),
    male_life_expectancy numeric(3,1),
    female_life_expectancy numeric(3,1),
);

create table infant_mortality(
    year_id integer primary key references year(id),
    average_infant_mortality numeric(3, 1),
    male_infant_mortality numeric(3,1),
    female_infant_mortality numeric(3, 1)
);
-- Inserting data

INSERT INTO year (name, head_of_state) 
VALUES (2023, 'Felipe Jacinto Nyusi');

INSERT INTO country_data (capital_city, official_language, independence_date, area_in_sqkm) 
VALUES ('Maputo', 'Portuguese', '1975-06-25', 799380);

INSERT INTO provinces (province_name, population_density, area_in_sqkm, year_id) 
VALUES 
  ('Niassa', 17, 129056, 1),
  ('Cabo Delgado', 33, 82625, 1),
  ('Nampula', 81, 81606, 1),
  ('Zambezia', 57, 105008, 1),
  ('Tete', 32, 100724, 1),
  ('Manica', 37, 61661, 1),
  ('Sofala', 39, 68018, 1),
  ('Inhambane', 23, 68815, 1),
  ('Gaza', 20, 75709, 1),
  ('Maputo', 95, 26058, 1),
  ('Cidade de Maputo', 3777, 300, 1);

INSERT INTO population_per_thousand (male_population, female_population, total, province_id)
VALUES 
  (1072, 1131, 2203, 1),
  (1337, 1408, 2745, 2),
  (3242, 3408, 6550, 3),
  (2895, 3108, 6004, 4),
  (1564, 1610, 3174, 5),
  (1111, 1188, 2299, 6),
  (1304, 1371, 2675, 7),
  (736, 845, 1581, 8),
  (673, 803, 1477, 9),
  (1198, 1282, 2480, 10),
  (551, 582, 1133, 11);

INSERT INTO population_percentual_structure (male_population, female_population, total, province_id)
VALUES 
  (6.8, 6.8, 6.8, 1),
  (8.5, 8.4, 8.5, 2),
  (20.7, 20.4, 20.5, 3),
  (18.5, 18.6, 18.5, 4),
  (10.0, 9.6, 9.8, 5),
  (7.1, 7.1, 7.1, 6),
  (8.3, 8.2, 8.3, 7),
  (4.7, 5.0, 4.9, 8),
  (4.3, 4.8, 4.6, 9),
  (7.6, 7.7, 7.6, 10),
  (3.5, 3.5, 3.5, 11);

INSERT INTO country_pop_indicators (total, male, female, urban_percentual, sex_ratio, gross_mortality_rate, gross_birth_rate, growth_rate, year_id)
VALUES 
  (32420, 15684, 16736, 34.7, 93.7, 11.7, 36.7, 2.5, 1);

INSERT INTO dependency_rate (year_id, total, young)
VALUES 
  (1, 91.5, 85.0);

INSERT INTO life_expectancy_at_birth (year_id, male_life_expectancy, female_life_expectancy)
VALUES 
  (1, 53.6, 59.5);

insert into infant_mortality (average_infant_mortality, male_infant_mortality, female_infant_mortality, year_id)
values
(63.9, 66.0, 61.8, 1);


-- updates and fixings

update life_expectancy_at_birth 
set male_life_expectancy = 53.2, female_life_expectancy = 59.1, average_life_expectancy = 56.1 WHERE year_id = 1;
