'use client';

import React, { useState } from 'react';
import { Guest } from '@/types';
import { Button } from './Button';

interface TagSelectorProps {
  guests: Guest[];
  selectedGuestIds: string[];
  onToggleGuest: (guestId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  loading?: boolean;
  alreadyTaggedIds?: string[];
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  guests,
  selectedGuestIds,
  onToggleGuest,
  onSave,
  onCancel,
  loading = false,
  alreadyTaggedIds = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuests = guests.filter((guest) =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search guests..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredGuests.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No guests found</p>
        ) : (
          filteredGuests.map((guest) => {
            const alreadyTagged = alreadyTaggedIds.includes(guest.id);
            return (
              <label
                key={guest.id}
                className={`flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ${alreadyTagged ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={alreadyTagged || selectedGuestIds.includes(guest.id)}
                  onChange={() => !alreadyTagged && onToggleGuest(guest.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={alreadyTagged}
                />
                <span className="ml-3 text-gray-900">{guest.name}</span>
                {alreadyTagged && <span className="ml-2 text-xs text-blue-600">Already tagged</span>}
              </label>
            );
          })
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={onSave} loading={loading} className="flex-1">
          Save Tags
        </Button>
        <Button onClick={onCancel} variant="secondary" className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};