POLICY_SCENARIOS = [
    {
        'id': 'SCENARIO-01',
        'name': 'Urban Expansion Control & Containment Boundary',
        'category': 'Urban Expansion',
        'description': 'Establishes a statutory Urban Growth Boundary (UGB) around PMRDA core and introduces Transfer of Development Rights (TDR) to restrict leapfrogging sprawl into agricultural peri-urban villages.',
        'default_intervention_pct': 10.0,
        'time_horizon_years': 5,
        'assumptions': [
            'Annual farmland conversion rate reduced by specified intervention percentage.',
            'Higher densification allowed within sanctioned Metro and Ring Road TOD zones (FSI increased to 3.5).',
            'Gram panchayat layout sanctions strictly vetted against PMRDA statutory zoning.'
        ]
    },
    {
        'id': 'SCENARIO-02',
        'name': 'Agricultural Prime-Soil Preservation & Crop Zoning',
        'category': 'Agriculture',
        'description': 'Mandates strict non-agricultural (NA) conversion moratorium on Class-I & II irrigated fertile soils across Baramati, Junnar, and Shirur with green credit subsidies for sustainable cultivation.',
        'default_intervention_pct': 15.0,
        'time_horizon_years': 5,
        'assumptions': [
            'Prohibits conversion of canal-command agricultural parcels exceeding 5 hectares.',
            'Provides compensatory solar agro-incentives of INR 25,000/acre/year for sustained farming.',
            'Redirects industrial expansion to notified MIDC scrub-land belts.'
        ]
    },
    {
        'id': 'SCENARIO-03',
        'name': 'Blue-Green Floodplain & Catchment Buffer Expansion',
        'category': 'Water Bodies',
        'description': 'Expands mandatory no-construction riparian buffers along Mula, Mutha, Indrayani, and Khadakwasla catchments by 25 to 50 meters, backed by satellite-enforced anti-encroachment sensors.',
        'default_intervention_pct': 20.0,
        'time_horizon_years': 5,
        'assumptions': [
            'Red line flood buffer strictly declared as unbuildable biodiversity zone.',
            'Stormwater permeability index in peri-urban layouts increased by 35%.',
            'Siltation in Khadakwasla reduced by 18% through catchment afforestation.'
        ]
    },
    {
        'id': 'SCENARIO-04',
        'name': 'Transit-Oriented Land Densification along Ring Road',
        'category': 'Infrastructure',
        'description': 'Clusters future commercial and high-density residential development within a 1-km radius of 14 Ring Road interchanges, avoiding peripheral farmland fragmentation.',
        'default_intervention_pct': 12.0,
        'time_horizon_years': 10,
        'assumptions': [
            'FSI bonus of 1.5 within 500m of mass transit corridors.',
            'Reduces vehicular trip lengths by 22% through mixed-use zoning.',
            'Saves 1,850 hectares of rural farmland from dispersed subdivision.'
        ]
    },
    {
        'id': 'SCENARIO-05',
        'name': 'Climate Resilience & Western Ghats Foothill Buffer',
        'category': 'Climate / Environment',
        'description': 'Enforces strict hillside conservation (slope > 15 deg) across Mulshi, Velhe, and Bhor with green infrastructure credits and eco-tourism covenants.',
        'default_intervention_pct': 25.0,
        'time_horizon_years': 5,
        'assumptions': [
            'Complete ban on hill-cutting and non-forest land conversion above 600m MSL.',
            'Local carbon sequestration capacity augmented by 45,000 MT CO2/year.',
            'Protects key headwater catchments feeding Nira and Bhima river basins.'
        ]
    }
]
