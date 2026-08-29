import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { itemService } from '../services/itemService';
import ItemCard from '../components/items/ItemCard';
import SearchBar from '../components/items/SearchBar';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const FoundItemsPage = () => {
  const routerLocation = useLocation();
  const initialFilters = routerLocation.state?.filters || {};

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('newest');

  const fetchFoundItems = async () => {
    setLoading(true);
    setError('');

    try {
      // Call GET /api/items?status=Found
      const data = await itemService.getItems({
        status: 'Found',
        query: filters.query || undefined,
        category: filters.category || undefined,
        location: filters.location || undefined,
      });

      let itemsList = Array.isArray(data) ? data : [];

      // Sort
      if (sortBy === 'newest') {
        itemsList.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));
      } else if (sortBy === 'oldest') {
        itemsList.sort((a, b) => new Date(a.created_at || a.date) - new Date(b.created_at || b.date));
      }

      setItems(itemsList);
    } catch (err) {
      console.error('Error fetching found items:', err);
      setError('Something went wrong loading found items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoundItems();
  }, [filters, sortBy]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Found Items Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Belongings found on campus. Verify ownership details to submit a recovery claim.
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sort By:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <SearchBar onSearch={handleSearch} initialFilters={filters} />

      {/* Error State */}
      {error && <ErrorMessage message={error} onRetry={fetchFoundItems} />}

      {/* Results Count & Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching live found items registry..." />
      ) : items.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500">
            Showing {items.length} found item{items.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No found items match your criteria"
          message="Try broadening your category or location filters."
        />
      )}
    </div>
  );
};

export default FoundItemsPage;
