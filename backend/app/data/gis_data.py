GIS_LAYERS = [
    {
        'layer_id': 'layer-admin-boundaries',
        'name': 'Administrative Boundaries (14 Talukas)',
        'category': 'Administrative Boundaries',
        'description': 'Official taluka polygons for all 14 sub-divisions of Pune District including Haveli, Pune City, Khed, Mulshi, Shirur, Baramati, Junnar, etc.',
        'color': '#1e3a8a',
        'default_active': True,
        'feature_count': 14,
        'is_demo_data': False,
        'source': 'Survey of India / MRSAC LGD GIS'
    },
    {
        'layer_id': 'layer-land-use',
        'name': 'Land Use / Land Cover (LULC 2023)',
        'category': 'Land Use / Land Cover',
        'description': 'Categorized land parcels: Urban Built-up, Intensive Agriculture, Forest Cover, Scrub/Wasteland, and Water Bodies.',
        'color': '#15803d',
        'default_active': True,
        'feature_count': 18,
        'is_demo_data': False,
        'source': 'NRSC Bhuvan ISRO LULC Grid'
    },
    {
        'layer_id': 'layer-urban-expansion',
        'name': 'Urban Expansion & High Pressure Zones',
        'category': 'Urban Expansion',
        'description': 'High-velocity growth nodes: Hinjawadi Phase 1-3, Wakad-Punawale, Wagholi-Lonikand, Kharadi-Hadapsar, and Chakan Industrial corridor.',
        'color': '#dc2626',
        'default_active': True,
        'feature_count': 8,
        'is_demo_data': False,
        'source': 'PMRDA Spatial Monitoring & Satellite Sprawl Index'
    },
    {
        'layer_id': 'layer-water-bodies',
        'name': 'Water Bodies, Reservoirs & Floodplains',
        'category': 'Water Bodies',
        'description': 'Khadakwasla, Panshet, Varasgaon, Pavana reservoirs and Mula-Mutha-Indrayani river channels with Blue/Red flood buffer lines.',
        'color': '#0284c7',
        'default_active': True,
        'feature_count': 9,
        'is_demo_data': False,
        'source': 'Water Resources Department (WRD) Maharashtra'
    },
    {
        'layer_id': 'layer-infrastructure',
        'name': 'Major Infrastructure & Pune Ring Road Corridor',
        'category': 'Infrastructure',
        'description': '173.7 km Greenfield Ring Road alignment, Pune Metro Lines 1/2/3, Pune-Mumbai Expressway, and Pune-Solapur Highway alignments.',
        'color': '#d97706',
        'default_active': False,
        'feature_count': 6,
        'is_demo_data': False,
        'source': 'MSRDC / Maha-Metro Pune GIS'
    },
    {
        'layer_id': 'layer-agriculture-protection',
        'name': 'Agricultural Prime-Soil & Canal Command Belts',
        'category': 'Agriculture',
        'description': 'High-yield sugarcane and horti-agro zones in Baramati, Daund, Indapur, and Junnar under statutory agricultural preservation.',
        'color': '#84cc16',
        'default_active': False,
        'feature_count': 7,
        'is_demo_data': False,
        'source': 'Department of Agriculture Maharashtra / MPKV'
    },
    {
        'layer_id': 'layer-climate-vulnerability',
        'name': 'Climate Vulnerability & Landslide/Flood Risk',
        'category': 'Climate / Environment',
        'description': 'Western Ghats slope landslide risk pockets (Velhe, Bhor, Maval) and drought/groundwater depletion vulnerability in Eastern talukas.',
        'color': '#7c3aed',
        'default_active': False,
        'feature_count': 8,
        'is_demo_data': False,
        'source': 'GSDA / IITM Climate Vulnerability Index'
    },
    {
        'layer_id': 'layer-research-projects',
        'name': 'Active Research Study Pilot Sites',
        'category': 'Research Projects',
        'description': 'Geocoded field study pilot locations for ongoing urban expansion, groundwater recharge, and land pooling research projects.',
        'color': '#06b6d4',
        'default_active': False,
        'feature_count': 6,
        'is_demo_data': True,
        'source': 'LandGov Pune Academic Collaboration Network'
    }
]

PUNE_GEOJSON_FEATURES = [
    {
        'id': 'feat-haveli',
        'name': 'Haveli Taluka (Metropolitan Periphery)',
        'taluka': 'Haveli',
        'category': 'Administrative Boundaries',
        'geometry_type': 'Polygon',
        'coordinates': [[[73.78, 18.42], [73.98, 18.42], [74.05, 18.60], [73.85, 18.65], [73.75, 18.55], [73.78, 18.42]]],
        'properties': {
            'area_sqkm': 1340,
            'population': '2,435,000',
            'urban_expansion_rate': '+6.8% / yr',
            'dominant_land_use': 'Mixed Built-up / Peri-Urban Agriculture',
            'primary_challenges': 'Rapid peri-urban conversion, high revenue mutation load, infrastructure deficit in merged villages.',
            'related_research': ['DOC-PUN-001', 'DOC-PUN-005', 'DOC-PUN-009'],
            'status': 'High Priority Urban Growth Node'
        },
        'source': 'PMRDA Spatial Database',
        'is_demo_data': False
    },
    {
        'id': 'feat-pune-city',
        'name': 'Pune City Taluka (Urban Core)',
        'taluka': 'Pune City',
        'category': 'Administrative Boundaries',
        'geometry_type': 'Polygon',
        'coordinates': [[[73.80, 18.48], [73.92, 18.48], [73.92, 18.56], [73.80, 18.56], [73.80, 18.48]]],
        'properties': {
            'area_sqkm': 331,
            'population': '3,850,000',
            'urban_expansion_rate': '+1.2% / yr (Redevelopment & Densification)',
            'dominant_land_use': 'High-Density Residential, Commercial, Institutional',
            'primary_challenges': 'Mula-Mutha floodplain encroachment, traffic congestion, UHI heat stress, heritage conservation.',
            'related_research': ['DOC-PUN-003', 'DOC-PUN-010', 'DOC-PUN-012'],
            'status': 'Statutory PMC Core'
        },
        'source': 'PMC Master Plan GIS',
        'is_demo_data': False
    },
    {
        'id': 'feat-mulshi',
        'name': 'Mulshi Taluka (Western Tech & Eco Belt)',
        'taluka': 'Mulshi',
        'category': 'Administrative Boundaries',
        'geometry_type': 'Polygon',
        'coordinates': [[[73.45, 18.45], [73.75, 18.48], [73.76, 18.62], [73.50, 18.65], [73.45, 18.45]]],
        'properties': {
            'area_sqkm': 1029,
            'population': '175,000',
            'urban_expansion_rate': '+8.4% / yr in Hinjawadi/Maan cluster',
            'dominant_land_use': 'IT Parks, Luxury Townships, Forest Catchments (Mulshi Lake)',
            'primary_challenges': 'Farmland fragmentation along IT corridor, hill-slope cutting, water security in upstream catchment.',
            'related_research': ['DOC-PUN-001', 'DOC-PUN-005'],
            'status': 'Major Economic Engine'
        },
        'source': 'PMRDA GIS',
        'is_demo_data': False
    },
    {
        'id': 'feat-khed',
        'name': 'Khed Taluka (Chakan Industrial & Northern Gateway)',
        'taluka': 'Khed',
        'category': 'Administrative Boundaries',
        'geometry_type': 'Polygon',
        'coordinates': [[[73.65, 18.65], [73.95, 18.68], [74.05, 18.95], [73.60, 18.92], [73.65, 18.65]]],
        'properties': {
            'area_sqkm': 1405,
            'population': '450,000',
            'urban_expansion_rate': '+5.2% / yr (Industrial Sprawl)',
            'dominant_land_use': 'Automobile Industrial Zones (MIDC), Intensive Agriculture',
            'primary_challenges': 'Industrial effluent management, ring road land acquisition, proposed international airport debate.',
            'related_research': ['DOC-PUN-009', 'DOC-PUN-002'],
            'status': 'Industrial Manufacturing Cluster'
        },
        'source': 'MIDC / Collectorate GIS',
        'is_demo_data': False
    },
    {
        'id': 'feat-baramati',
        'name': 'Baramati Taluka (Agro-Industrial Engine)',
        'taluka': 'Baramati',
        'category': 'Administrative Boundaries',
        'geometry_type': 'Polygon',
        'coordinates': [[[74.35, 18.05], [74.75, 18.08], [74.70, 18.35], [74.30, 18.30], [74.35, 18.05]]],
        'properties': {
            'area_sqkm': 1382,
            'population': '430,000',
            'urban_expansion_rate': '+2.4% / yr',
            'dominant_land_use': 'Sugarcane & Horticulture, Nira Canal Irrigation, Agro-processing MIDC',
            'primary_challenges': 'Soil salinization from over-irrigation, groundwater depletion in tail-end canal villages.',
            'related_research': ['DOC-PUN-006', 'DOC-PUN-004'],
            'status': 'Prime Agricultural Preserve'
        },
        'source': 'Department of Agriculture Maharashtra',
        'is_demo_data': False
    },
    {
        'id': 'feat-shirur',
        'name': 'Shirur Taluka (Ranjangaon Industrial & Agrarian)',
        'taluka': 'Shirur',
        'category': 'Administrative Boundaries',
        'geometry_type': 'Polygon',
        'coordinates': [[[74.05, 18.65], [74.50, 18.68], [74.55, 18.95], [74.05, 18.90], [74.05, 18.65]]],
        'properties': {
            'area_sqkm': 1558,
            'population': '385,000',
            'urban_expansion_rate': '+4.1% / yr',
            'dominant_land_use': 'MIDC Electronics Zone, Rainfed & Canal Agriculture',
            'primary_challenges': 'Groundwater overdraft, rapid conversion along Pune-Nagar highway corridor.',
            'related_research': ['DOC-PUN-006', 'DOC-PUN-002'],
            'status': 'Industrial-Agro Interface'
        },
        'source': 'Collectorate Pune',
        'is_demo_data': False
    },
    {
        'id': 'feat-junnar',
        'name': 'Junnar Taluka (Eco-Heritage & Agri Zone)',
        'taluka': 'Junnar',
        'category': 'Administrative Boundaries',
        'geometry_type': 'Polygon',
        'coordinates': [[[73.70, 19.05], [74.15, 19.08], [74.10, 19.38], [73.65, 19.35], [73.70, 19.05]]],
        'properties': {
            'area_sqkm': 1384,
            'population': '395,000',
            'urban_expansion_rate': '+0.9% / yr',
            'dominant_land_use': 'Tomato & Vegetable Belt, Shivneri Fort Heritage, Western Ghats Reserve',
            'primary_challenges': 'Leopard-human land boundary interactions, Eco-Sensitive Zone restrictions, dam catchment erosion.',
            'related_research': ['DOC-PUN-008'],
            'status': 'Agro-Tourism & Eco Preserve'
        },
        'source': 'Forest Department Pune',
        'is_demo_data': False
    },
    {
        'id': 'feat-sprawl-hinjawadi',
        'name': 'Hinjawadi - Maan High Pressure Tech Sprawl Zone',
        'taluka': 'Mulshi',
        'category': 'Urban Expansion',
        'geometry_type': 'Polygon',
        'coordinates': [[[73.68, 18.56], [73.76, 18.57], [73.76, 18.62], [73.69, 18.61], [73.68, 18.56]]],
        'properties': {
            'area_sqkm': 48.5,
            'urban_growth_velocity': 'High (+14.2% decadal)',
            'farmland_converted_since_2015': '2,400 Hectares',
            'impervious_surface_index': '0.74',
            'recommended_policy': 'Enforce mandatory 20% blue-green stormwater buffer & TP Scheme land pooling.',
            'related_research': ['DOC-PUN-001', 'DOC-PUN-005'],
            'source': 'PMRDA Spatial Monitoring Cell'
        },
        'source': 'PMRDA GIS',
        'is_demo_data': False
    },
    {
        'id': 'feat-sprawl-wagholi',
        'name': 'Wagholi - Lonikand Eastern Growth Axis',
        'taluka': 'Haveli',
        'category': 'Urban Expansion',
        'geometry_type': 'Polygon',
        'coordinates': [[[73.95, 18.55], [74.05, 18.56], [74.04, 18.64], [73.96, 18.63], [73.95, 18.55]]],
        'properties': {
            'area_sqkm': 54.2,
            'urban_growth_velocity': 'Very High (+16.8% decadal)',
            'farmland_converted_since_2015': '3,100 Hectares',
            'water_tanker_dependence': '84% of residential complexes',
            'recommended_policy': 'Moratorium on large un-serviced residential layouts without piped water and STP infrastructure.',
            'related_research': ['DOC-PUN-001', 'DOC-PUN-002'],
            'source': 'Pune LandGov Urban Cell (Demo Layer)'
        },
        'source': 'Demo Synthetic Dataset',
        'is_demo_data': True
    },
    {
        'id': 'feat-water-khadakwasla',
        'name': 'Khadakwasla Dam & Mutha River Upstream Basin',
        'taluka': 'Haveli',
        'category': 'Water Bodies',
        'geometry_type': 'Polygon',
        'coordinates': [[[73.72, 18.40], [73.79, 18.41], [73.80, 18.45], [73.74, 18.46], [73.72, 18.40]]],
        'properties': {
            'reservoir_capacity': '1.97 TMC (Drinking water life-line for Pune)',
            'catchment_area': '501 sq km',
            'buffer_status': 'Protected Water Catchment Zone',
            'encroachment_risk': 'Medium along Sinhagad road fringe',
            'related_research': ['DOC-PUN-003', 'DOC-PUN-010']
        },
        'source': 'WRD Maharashtra',
        'is_demo_data': False
    },
    {
        'id': 'feat-infra-ringroad',
        'name': 'Pune Greenfield Ring Road (173.7 km Alignment)',
        'taluka': 'Multiple (Haveli, Khed, Mulshi, Maval, Purandar, Bhor)',
        'category': 'Infrastructure',
        'geometry_type': 'LineString',
        'coordinates': [
            [73.65, 18.72], [73.72, 18.68], [73.70, 18.52], [73.75, 18.38], 
            [73.95, 18.35], [74.08, 18.45], [74.12, 18.62], [73.98, 18.78], [73.65, 18.72]
        ],
        'properties': {
            'total_length_km': 173.7,
            'right_of_way_m': 110,
            'acquired_land_ha': 1430,
            'interchanges': 14,
            'status': 'Land Acquisition in Final Stages / Tender Phase',
            'related_research': ['DOC-PUN-009', 'DOC-PUN-002']
        },
        'source': 'MSRDC GIS',
        'is_demo_data': False
    }
]
