import React from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { formatDate } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Link href={`/photographer/events/${event.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {event.title}
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center">
            <span className="font-medium mr-2">📅</span>
            {formatDate(event.date)}
          </p>
          <p className="flex items-center">
            <span className="font-medium mr-2">📍</span>
            {event.location}
          </p>
          <p className="flex items-center">
            <span className="font-medium mr-2">🎭</span>
            {event.type}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-blue-600 text-sm font-medium hover:text-blue-700">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};