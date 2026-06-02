export default function BrandsSection() {
  const brands = ['HP', 'Canon', 'Epson', 'Brother', 'Samsung', 'Xerox', 'Ricoh', 'Kyocera'];

  return (
    <section className="py-14 px-4 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="section-title">برندهای معتبر</h2>
          <p className="section-subtitle">نمایندگی و توزیع رسمی محصولات</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {brands.map(brand => (
            <div
              key={brand}
              className="flex items-center justify-center w-28 h-16 bg-gray-50 hover:bg-navy-50 border border-gray-100 hover:border-navy-200 rounded-2xl transition-all duration-200 cursor-default group"
            >
              <span className="font-bold text-gray-500 group-hover:text-navy-700 text-base transition-colors">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
