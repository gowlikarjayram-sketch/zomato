const cloudKitchens = [
  {
    id: 'ck-1',
    name: 'Ghar Ka Khana Kitchen',
    cuisine: 'North Indian Daily Thali • Dal Tadka • Phulkas',
  },
];
const searchQuery = 'Thali';
const filteredKitchens = cloudKitchens.filter((k) => {
    return (
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    );
});
console.log(filteredKitchens);
