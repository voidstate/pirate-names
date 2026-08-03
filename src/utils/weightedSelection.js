export const normalizeTemplateEntries = ( templates ) =>
	templates.map( ( entry ) =>
	{
		if ( typeof entry === 'string' ) {
			return { template: entry, weight: 1 }
		}

		return {
			template: entry.template,
			weight: Number.isFinite( entry.weight ) ? entry.weight : 1,
		}
	} )

export const pickWeightedItem = ( entries ) =>
{
	if ( !entries.length ) {
		return null
	}

	const totalWeight = entries.reduce( ( sum, entry ) => sum + Math.max( 0, entry.weight ), 0 )

	if ( totalWeight <= 0 ) {
		return entries[ 0 ]
	}

	let randomValue = Math.random() * totalWeight

	for ( const entry of entries ) {
		const weight = Math.max( 0, entry.weight )
		randomValue -= weight
		if ( randomValue <= 0 ) {
			return entry
		}
	}

	return entries[ entries.length - 1 ]
}
