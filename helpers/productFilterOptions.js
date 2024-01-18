let prices = [
    { name: '$0 - $25', count: 0 },
    { name: '$25 - $50', count: 0 },
    { name: '$50 - $75', count: 0 },
    { name: '$75 - $100', count: 0 },
    { name: '$100', count: 0 },
]

let themes = [
    { name: 'Art', count: 0 },
    { name: 'BrickHeadz', count: 0 },
    { name: 'City', count: 0 },
    { name: 'Creator 3-in-1', count: 0 },
    { name: 'Creator Expert', count: 0 },
    { name: 'Disney Mickey and Friends', count: 0 },
]

let interests = [
    { name: 'Aeroplanes', count: 0 },
    { name: 'Animals', count: 0 },
    { name: 'Art, Design & Music', count: 0 },
    { name: 'Arts and crafts', count: 0 },
    { name: 'Boats', count: 0 },
    { name: 'Buildings', count: 0 },
]

let filtersOptions = [
    { name: "price", value: prices },
    { name: "theme", value: themes },
    { name: "interest", value: interests }
]

module.exports = filtersOptions;