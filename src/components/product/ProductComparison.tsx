import React from 'react';
import { Check, X } from 'lucide-react';
import { sizeOptions } from './SizeSelector';
import { coverOptions } from './CoverTypeSelector';
import { paperOptions } from './PaperTypeSelector';

export const ProductComparison: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Product Comparison Guide
      </h2>

      {/* Size Comparison */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#28BAAB]">
          Size Options
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#28BAAB] to-[#0376AD] text-white">
                <th className="px-4 py-3 text-left rounded-tl-lg">Size</th>
                <th className="px-4 py-3 text-left">Dimensions</th>
                <th className="px-4 py-3 text-left">Best For</th>
                <th className="px-4 py-3 text-left rounded-tr-lg">Starting Price</th>
              </tr>
            </thead>
            <tbody>
              {sizeOptions.map((size, idx) => (
                <tr key={size.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3 font-semibold text-gray-900">{size.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{size.dimensions}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{size.description}</td>
                  <td className="px-4 py-3 font-bold text-[#0376AD]">${size.basePrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cover Type Comparison */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#28BAAB]">
          Cover Types
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#28BAAB] to-[#0376AD] text-white">
                <th className="px-4 py-3 text-left rounded-tl-lg">Cover Type</th>
                <th className="px-4 py-3 text-center">Durability</th>
                <th className="px-4 py-3 text-center">Layflat</th>
                <th className="px-4 py-3 text-center">Budget-Friendly</th>
                <th className="px-4 py-3 text-left rounded-tr-lg">Price Modifier</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">Hardcover</td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-4 py-3 font-semibold text-gray-600">Included</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 font-semibold text-gray-900">Softcover</td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs text-gray-600">Good</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                  <Check className="w-5 h-5 text-green-600 mx-auto -mt-2" />
                </td>
                <td className="px-4 py-3 font-semibold text-green-600">-$10.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">Layflat Hardcover</td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                  <Check className="w-5 h-5 text-green-600 mx-auto -mt-2" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="px-4 py-3 font-semibold text-[#0376AD]">+$20.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Paper Type Comparison */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#28BAAB]">
          Paper Types
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#28BAAB] to-[#0376AD] text-white">
                <th className="px-4 py-3 text-left rounded-tl-lg">Paper Type</th>
                <th className="px-4 py-3 text-center">No Glare</th>
                <th className="px-4 py-3 text-center">Color Vibrancy</th>
                <th className="px-4 py-3 text-center">Professional</th>
                <th className="px-4 py-3 text-left rounded-tr-lg">Price Modifier</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">Matte</td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                  <Check className="w-5 h-5 text-green-600 mx-auto -mt-2" />
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs text-gray-600">Good</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-4 py-3 font-semibold text-gray-600">Included</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 font-semibold text-gray-900">Glossy</td>
                <td className="px-4 py-3 text-center">
                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                  <Check className="w-5 h-5 text-green-600 mx-auto -mt-2" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-4 py-3 font-semibold text-[#0376AD]">+$5.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">Silk (Lustre)</td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                  <Check className="w-5 h-5 text-green-600 mx-auto -mt-2" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                  <Check className="w-5 h-5 text-green-600 mx-auto -mt-2" />
                </td>
                <td className="px-4 py-3 font-semibold text-[#0376AD]">+$8.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-gradient-to-r from-[#28BAAB]/10 to-[#0376AD]/10 rounded-lg">
        <h4 className="font-bold text-gray-900 mb-2">Page Count Pricing</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Base: 20 pages included with every book</li>
          <li>• Additional pages: $0.75 per page</li>
          <li>• Maximum: 200 pages</li>
          <li>• Pro tip: Books with 100+ pages offer excellent value</li>
        </ul>
      </div>
    </div>
  );
};
