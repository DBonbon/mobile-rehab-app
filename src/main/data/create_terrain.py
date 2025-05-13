from main.models import TerrainType
TerrainType.objects.all()

terrain_names = ['mountain', 'desert', 'glacier']

for name in terrain_names:
    identifier = name.lower().replace(' ', '-')  # Ensure identifier is slugified
    terrain, created = TerrainType.objects.get_or_create(
        identifier=identifier,
        defaults={
            'name': name,
            'description': f'Default description for {name}'
        }
    )
    if created:
        print(f"✅ Created terrain: {name}")
    else:
        print(f"ℹ️ Terrain already exists: {name}")
