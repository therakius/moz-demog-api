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
    male_population integer,
    female_population integer,
    total integer,
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