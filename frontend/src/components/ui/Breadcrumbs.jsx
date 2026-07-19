import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Breadcrumbs = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex items-center space-x-1 sm:space-x-2 text-sm text-text-muted">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />}
            {item.href ? (
              <Link
                to={item.href}
                className="hover:text-text-primary transition-colors font-medium truncate max-w-[150px] sm:max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-text-primary font-semibold truncate max-w-[150px] sm:max-w-[200px]" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
