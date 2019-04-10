--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.6
-- Dumped by pg_dump version 10.5

CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;
SET row_security = off;

--
-- Name: gist_geometry_ops; Type: OPERATOR FAMILY; Schema: public; Owner: _root
--

CREATE OPERATOR FAMILY public.gist_geometry_ops USING gist;


ALTER OPERATOR FAMILY public.gist_geometry_ops USING gist OWNER TO _root;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: data_exchange; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.data_exchange (
    id integer NOT NULL,
    lieu character varying(256),
    commune character varying(100),
    altitude integer,
    gps character varying(15) NOT NULL,
    massif character varying(50),
    geom public.geometry,
    unite character varying DEFAULT 'PG38'::character varying,
    session character varying,
    utm character(20),
    tgi character varying(100)
);


ALTER TABLE public.data_exchange OWNER TO admin;

--
-- Name: data_exchange_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.data_exchange_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.data_exchange_id_seq OWNER TO admin;

--
-- Name: data_exchange_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.data_exchange_id_seq OWNED BY public.data_exchange.id;


--
-- Name: lst_activites; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.lst_activites (
    id integer NOT NULL,
    categorie character varying(100) NOT NULL,
    activites character varying(100) NOT NULL
);


ALTER TABLE public.lst_activites OWNER TO admin;

--
-- Name: lst_activites_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.lst_activites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lst_activites_id_seq OWNER TO admin;

--
-- Name: lst_activites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.lst_activites_id_seq OWNED BY public.lst_activites.id;


--
-- Name: lst_blessures; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.lst_blessures (
    id integer NOT NULL,
    categorie character varying(256) NOT NULL,
    blessures character varying(256) NOT NULL
);


ALTER TABLE public.lst_blessures OWNER TO admin;

--
-- Name: lst_blessures_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.lst_blessures_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lst_blessures_id_seq OWNER TO admin;

--
-- Name: lst_blessures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.lst_blessures_id_seq OWNED BY public.lst_blessures.id;


--
-- Name: lst_communes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.lst_communes (
    id_commune integer NOT NULL,
    dept character varying(256) NOT NULL,
    commune character varying(60) NOT NULL
);


ALTER TABLE public.lst_communes OWNER TO admin;

--
-- Name: lst_communes_id_commune_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.lst_communes_id_commune_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lst_communes_id_commune_seq OWNER TO admin;

--
-- Name: lst_communes_id_commune_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.lst_communes_id_commune_seq OWNED BY public.lst_communes.id_commune;


--
-- Name: lst_etat; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.lst_etat (
    id integer NOT NULL,
    etat character varying(256) NOT NULL
);


ALTER TABLE public.lst_etat OWNER TO admin;

--
-- Name: lst_etat_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.lst_etat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lst_etat_id_seq OWNER TO admin;

--
-- Name: lst_etat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.lst_etat_id_seq OWNED BY public.lst_etat.id;


--
-- Name: lst_evacuation; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.lst_evacuation (
    id integer NOT NULL,
    lieu_evacuation character varying(256) NOT NULL
);


ALTER TABLE public.lst_evacuation OWNER TO admin;

--
-- Name: lst_evacuation_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.lst_evacuation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lst_evacuation_id_seq OWNER TO admin;

--
-- Name: lst_evacuation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.lst_evacuation_id_seq OWNED BY public.lst_evacuation.id;


--
-- Name: lst_lieux; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.lst_lieux (
    id integer NOT NULL,
    lieu character varying(256) NOT NULL,
    massif character varying(100) NOT NULL,
    commune character varying(100) NOT NULL,
    altitude integer NOT NULL,
    gps character varying(15) NOT NULL,
    geom public.geometry
);


ALTER TABLE public.lst_lieux OWNER TO admin;

--
-- Name: lst_lieux_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.lst_lieux_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lst_lieux_id_seq OWNER TO admin;

--
-- Name: lst_lieux_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.lst_lieux_id_seq OWNED BY public.lst_lieux.id;


--
-- Name: lst_massifs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.lst_massifs (
    id integer NOT NULL,
    massifs character varying(256) NOT NULL,
    geom public.geometry
);


ALTER TABLE public.lst_massifs OWNER TO admin;

--
-- Name: lst_massifs_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.lst_massifs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lst_massifs_id_seq OWNER TO admin;

--
-- Name: lst_massifs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.lst_massifs_id_seq OWNED BY public.lst_massifs.id;


--
-- Name: lst_nationalites; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.lst_nationalites (
    id integer NOT NULL,
    pays character varying(256) NOT NULL
);


ALTER TABLE public.lst_nationalites OWNER TO admin;

--
-- Name: lst_nationalites_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.lst_nationalites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lst_nationalites_id_seq OWNER TO admin;

--
-- Name: lst_nationalites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.lst_nationalites_id_seq OWNED BY public.lst_nationalites.id;


--
-- Name: lst_personnels; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.lst_personnels (
    id integer NOT NULL,
    ordre integer NOT NULL,
    type character varying(256),
    organisme character varying(256),
    lieu character varying(256),
    nom character varying(256),
    prenom character varying(256),
    grade character varying(3),
    tph character varying(12),
    op boolean
);


ALTER TABLE public.lst_personnels OWNER TO admin;

--
-- Name: lst_personnels_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.lst_personnels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lst_personnels_id_seq OWNER TO admin;

--
-- Name: lst_personnels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.lst_personnels_id_seq OWNED BY public.lst_personnels.id;


--
-- Name: num_fiche_annee; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.num_fiche_annee
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1
    CYCLE;


ALTER TABLE public.num_fiche_annee OWNER TO admin;

--
-- Name: tab_secours; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.tab_secours (
    id integer NOT NULL,
    alerte_gdh timestamp without time zone,
    alerte_moyen character varying(10),
    alerte_origine character varying(20),
    loc_lieu character varying(256),
    loc_massif character varying(256),
    loc_commune character varying(256),
    loc_gps character varying(15),
    loc_alt integer,
    loc_complement character varying(256),
    gp character varying(60),
    planton character varying(60),
    pv integer,
    chk_conf3 smallint,
    "chk_confCodis" character varying(20),
    "chk_confSamu" character varying(20),
    "chk_confCorg" character varying(20),
    "chk_confPghm" character varying(20),
    "chk_confRequerant" character varying(20),
    chk_tph smallint,
    tph_intl character varying(30),
    tph_nat character varying(30),
    requerant character varying(60),
    acc_gdh timestamp without time zone,
    acc_activites character varying(100),
    acc_sexe character varying(1),
    acc_blessures character varying(256),
    acc_bilan character varying(1),
    acc_rsgts text,
    rech_vl text,
    rech_pers text,
    chk_rech smallint,
    chk_hemorragie smallint,
    meteo character varying(50),
    vent character varying(50),
    caravane smallint,
    rsgts_divers text,
    rsgts_circonstances text,
    rsgts_check smallint,
    rsgts_professionnel text,
    op character varying(60),
    rsgts_mp text,
    geom public.geometry,
    chk_pci smallint,
    chk_hc smallint,
    lon character varying(8),
    lat character varying(9),
    chk_bsm smallint,
    chk_cro smallint,
    chk_pulsar smallint,
    chk_mprelevage smallint,
    chk_mpcollier smallint,
    chk_mpattelle smallint,
    chk_mpked smallint,
    chk_mpperche smallint,
    chk_mptreuillage smallint,
    chk_mpmam smallint,
    chk_mpo2 smallint,
    chk_mpmid smallint,
    loc_utm character varying,
    suivi character varying,
    inter character varying,
    fiche smallint DEFAULT nextval('public.num_fiche_annee'::regclass)
);


ALTER TABLE public.tab_secours OWNER TO admin;

--
-- Name: secours; Type: VIEW; Schema: public; Owner: admin
--

CREATE VIEW public.secours AS
 SELECT tab_secours.id,
    tab_secours.alerte_gdh,
    tab_secours.alerte_moyen,
    tab_secours.alerte_origine,
    tab_secours.loc_lieu,
    tab_secours.loc_massif,
    tab_secours.loc_commune,
    tab_secours.loc_gps,
    tab_secours.loc_alt,
    tab_secours.loc_complement,
    tab_secours.gp,
    tab_secours.planton,
    tab_secours.pv,
    tab_secours.chk_conf3,
    tab_secours."chk_confCodis",
    tab_secours."chk_confSamu",
    tab_secours."chk_confCorg",
    tab_secours."chk_confPghm",
    tab_secours."chk_confRequerant",
    tab_secours.chk_tph,
    tab_secours.tph_intl,
    tab_secours.tph_nat,
    tab_secours.requerant,
    tab_secours.acc_gdh,
    tab_secours.acc_activites,
    tab_secours.acc_sexe,
    tab_secours.acc_blessures,
    tab_secours.acc_bilan,
    tab_secours.acc_rsgts,
    tab_secours.rech_vl,
    tab_secours.rech_pers,
    tab_secours.chk_rech,
    tab_secours.chk_hemorragie,
    tab_secours.meteo,
    tab_secours.vent,
    tab_secours.caravane,
    tab_secours.rsgts_divers,
    tab_secours.rsgts_circonstances,
    tab_secours.rsgts_check,
    tab_secours.rsgts_professionnel,
    tab_secours.op,
    tab_secours.rsgts_mp,
    tab_secours.geom,
    tab_secours.fiche
   FROM public.tab_secours
  WHERE (((tab_secours.alerte_gdh)::text)::date = ('now'::text)::date);


ALTER TABLE public.secours OWNER TO admin;

--
-- Name: tab_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.tab_config (
    id integer NOT NULL,
    annee integer,
    unite character varying(256),
    code_unite character varying(10),
    commune character varying(100),
    departement character varying(100)
);


ALTER TABLE public.tab_config OWNER TO admin;

--
-- Name: tab_config_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.tab_config_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tab_config_id_seq OWNER TO admin;

--
-- Name: tab_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.tab_config_id_seq OWNED BY public.tab_config.id;


--
-- Name: tab_deroulement; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.tab_deroulement (
    deroulement_id integer NOT NULL,
    secours_id integer NOT NULL,
    deroulement_gdh timestamp without time zone NOT NULL,
    deroulement_texte character varying(256)
);


ALTER TABLE public.tab_deroulement OWNER TO admin;

--
-- Name: tab_deroulement_deroulement_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.tab_deroulement_deroulement_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tab_deroulement_deroulement_id_seq OWNER TO admin;

--
-- Name: tab_deroulement_deroulement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.tab_deroulement_deroulement_id_seq OWNED BY public.tab_deroulement.deroulement_id;


--
-- Name: tab_moyens; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.tab_moyens (
    id integer NOT NULL,
    secours_id integer,
    type character varying(256),
    organisme character varying(256),
    lieu character varying(256),
    nom character varying(256),
    prenom character varying(256),
    grade character varying(3)
);


ALTER TABLE public.tab_moyens OWNER TO admin;

--
-- Name: tab_moyens_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.tab_moyens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tab_moyens_id_seq OWNER TO admin;

--
-- Name: tab_moyens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.tab_moyens_id_seq OWNED BY public.tab_moyens.id;


--
-- Name: tab_secours_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.tab_secours_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tab_secours_id_seq OWNER TO admin;

--
-- Name: tab_secours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.tab_secours_id_seq OWNED BY public.tab_secours.id;


--
-- Name: tab_victimes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.tab_victimes (
    id integer NOT NULL,
    secours_id integer,
    nom character varying(256),
    prenom character varying(256),
    sexe character varying(1),
    naissance_date timestamp without time zone,
    naissance_lieu character varying(256),
    nationalite character varying(256),
    filiation character varying(256),
    adresse character varying(256),
    adresse_commune character varying(256),
    tph character varying(256),
    profession character varying(256),
    etat character varying(256),
    blessures character varying(256),
    evacuation character varying(256)
);


ALTER TABLE public.tab_victimes OWNER TO admin;

--
-- Name: tab_victimes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.tab_victimes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tab_victimes_id_seq OWNER TO admin;

--
-- Name: tab_victimes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.tab_victimes_id_seq OWNED BY public.tab_victimes.id;


--
-- Name: data_exchange id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.data_exchange ALTER COLUMN id SET DEFAULT nextval('public.data_exchange_id_seq'::regclass);


--
-- Name: lst_activites id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lst_activites ALTER COLUMN id SET DEFAULT nextval('public.lst_activites_id_seq'::regclass);


--
-- Name: lst_blessures id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lst_blessures ALTER COLUMN id SET DEFAULT nextval('public.lst_blessures_id_seq'::regclass);


--
-- Name: lst_communes id_commune; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lst_communes ALTER COLUMN id_commune SET DEFAULT nextval('public.lst_communes_id_commune_seq'::regclass);


--
-- Name: lst_etat id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lst_etat ALTER COLUMN id SET DEFAULT nextval('public.lst_etat_id_seq'::regclass);


--
-- Name: lst_evacuation id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lst_evacuation ALTER COLUMN id SET DEFAULT nextval('public.lst_evacuation_id_seq'::regclass);


--
-- Name: lst_lieux id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lst_lieux ALTER COLUMN id SET DEFAULT nextval('public.lst_lieux_id_seq'::regclass);


--
-- Name: lst_massifs id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lst_massifs ALTER COLUMN id SET DEFAULT nextval('public.lst_massifs_id_seq'::regclass);


--
-- Name: lst_nationalites id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lst_nationalites ALTER COLUMN id SET DEFAULT nextval('public.lst_nationalites_id_seq'::regclass);


--
-- Name: lst_personnels id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lst_personnels ALTER COLUMN id SET DEFAULT nextval('public.lst_personnels_id_seq'::regclass);


--
-- Name: tab_config id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tab_config ALTER COLUMN id SET DEFAULT nextval('public.tab_config_id_seq'::regclass);


--
-- Name: tab_deroulement deroulement_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tab_deroulement ALTER COLUMN deroulement_id SET DEFAULT nextval('public.tab_deroulement_deroulement_id_seq'::regclass);


--
-- Name: tab_moyens id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tab_moyens ALTER COLUMN id SET DEFAULT nextval('public.tab_moyens_id_seq'::regclass);


--
-- Name: tab_secours id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tab_secours ALTER COLUMN id SET DEFAULT nextval('public.tab_secours_id_seq'::regclass);


--
-- Name: tab_victimes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tab_victimes ALTER COLUMN id SET DEFAULT nextval('public.tab_victimes_id_seq'::regclass);


--
-- Name: data_exchange data_exchange_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.data_exchange
    ADD CONSTRAINT data_exchange_pkey PRIMARY KEY (id);


--
-- Name: tab_secours idx; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tab_secours
    ADD CONSTRAINT idx PRIMARY KEY (id);


--
-- Name: lst_blessures lst_blessures_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lst_blessures
    ADD CONSTRAINT lst_blessures_pkey PRIMARY KEY (id);


--
-- Name: lst_lieux lst_lieux_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lst_lieux
    ADD CONSTRAINT lst_lieux_pkey PRIMARY KEY (id);


--
-- Name: lst_personnels lst_personnels_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lst_personnels
    ADD CONSTRAINT lst_personnels_pkey PRIMARY KEY (id);


--
-- Name: tab_deroulement tab_deroulement_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tab_deroulement
    ADD CONSTRAINT tab_deroulement_pkey PRIMARY KEY (deroulement_id);


--
-- Name: tab_moyens tab_moyens_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tab_moyens
    ADD CONSTRAINT tab_moyens_pkey PRIMARY KEY (id);


--
-- Name: tab_victimes tab_victimes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tab_victimes
    ADD CONSTRAINT tab_victimes_pkey PRIMARY KEY (id);


--
-- Name: idx_communes; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX idx_communes ON public.lst_communes USING btree (id_commune, commune);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO admin;


--
-- PostgreSQL database dump complete
--
