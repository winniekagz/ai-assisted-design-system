'use client';

import {
  AlertTriangle,
  Award,
  CheckCircle,
  Clock,
  Heart,
  Info,
  Shield,
  Star,
  XCircle,
  Zap,
} from 'lucide-react';

import { BadgeStatus, BadgeStatusConfig } from '../../types/badgw';
import { Badge } from '../ui/badge/badge';
import { Card, CardContent, CardTitle } from '../ui/card';

export function BadgeDemo() {
  const statuses: BadgeStatus[] = [
    'success',
    'pending',
    'error',
    'completed',
    'neutral',
  ];

  const customStatusConfig: BadgeStatusConfig = {
    premium: {
      colors: {
        filled: {
          bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
          text: 'text-white',
        },
        outlined: {
          bg: 'bg-purple-50',
          text: 'text-purple-600',
          border: 'border-purple-500',
        },
        pastel: {
          bg: 'bg-purple-100',
          text: 'text-purple-700',
        },
      },
    },
    featured: {
      colors: {
        filled: {
          bg: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          text: 'text-white',
        },
        outlined: {
          bg: 'bg-yellow-50',
          text: 'text-yellow-600',
          border: 'border-yellow-500',
        },
        pastel: {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
        },
      },
    },
  };

  return (
    <div className='space-y-8 p-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold mb-4'>Badge Component Demo</h1>
        <p className='text-muted-foreground text-lg'>
          Explore different badge variants, sizes, and use cases
        </p>
      </div>

      {/* Default Status Badges */}
      <Card>
        <CardContent className='pt-6'>
          <CardTitle>Default Status Badges</CardTitle>
          <p className='text-muted-foreground mb-4'>
            Pre-configured status badges with semantic colors
          </p>

          <div className='space-y-4'>
            <div>
              <h4 className='font-semibold mb-2'>Filled Variant</h4>
              <div className='flex flex-wrap gap-2'>
                {statuses.map(status => (
                  <Badge key={status} status={status} variant='filled'>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-2'>Outlined Variant</h4>
              <div className='flex flex-wrap gap-2'>
                {statuses.map(status => (
                  <Badge key={status} status={status} variant='outlined'>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-2'>Pastel Variant</h4>
              <div className='flex flex-wrap gap-2'>
                {statuses.map(status => (
                  <Badge key={status} status={status} variant='pastel'>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badge Sizes */}
      <Card>
        <CardContent className='pt-6'>
          <CardTitle>Badge Sizes</CardTitle>
          <p className='text-muted-foreground mb-4'>
            Different sizes for various use cases
          </p>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge status='success' size='sm'>
              Small
            </Badge>
            <Badge status='success' size='md'>
              Medium
            </Badge>
            <Badge status='success' size='lg'>
              Large
            </Badge>
            <Badge status='success' size='xl'>
              Extra Large
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Badges with Icons */}
      <Card>
        <CardContent className='pt-6'>
          <CardTitle>Badges with Icons</CardTitle>
          <p className='text-muted-foreground mb-4'>
            Badges can include icons for better visual communication
          </p>

          <div className='space-y-4'>
            <div>
              <h4 className='font-semibold mb-2'>Icons at Start</h4>
              <div className='flex flex-wrap gap-2'>
                <Badge status='success' icon={CheckCircle}>
                  Success
                </Badge>
                <Badge status='pending' icon={Clock}>
                  Pending
                </Badge>
                <Badge status='error' icon={XCircle}>
                  Error
                </Badge>
                <Badge status='completed' icon={Info}>
                  Completed
                </Badge>
                <Badge status='neutral' icon={AlertTriangle}>
                  Neutral
                </Badge>
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-2'>Icons at End</h4>
              <div className='flex flex-wrap gap-2'>
                <Badge status='success' icon={Star} iconPosition='end'>
                  Featured
                </Badge>
                <Badge status='pending' icon={Heart} iconPosition='end'>
                  Liked
                </Badge>
                <Badge status='error' icon={Zap} iconPosition='end'>
                  Priority
                </Badge>
                <Badge status='completed' icon={Shield} iconPosition='end'>
                  Protected
                </Badge>
                <Badge status='neutral' icon={Award} iconPosition='end'>
                  Awarded
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Status Badges */}
      <Card>
        <CardContent className='pt-6'>
          <CardTitle>Custom Status Badges</CardTitle>
          <p className='text-muted-foreground mb-4'>
            Custom status badges with unique styling
          </p>

          <div className='space-y-4'>
            <div>
              <h4 className='font-semibold mb-2'>Premium Badges</h4>
              <div className='flex flex-wrap gap-2'>
                <Badge
                  status='premium'
                  statusConfig={customStatusConfig}
                  variant='filled'
                >
                  Premium
                </Badge>
                <Badge
                  status='premium'
                  statusConfig={customStatusConfig}
                  variant='outlined'
                >
                  Premium
                </Badge>
                <Badge
                  status='premium'
                  statusConfig={customStatusConfig}
                  variant='pastel'
                >
                  Premium
                </Badge>
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-2'>Featured Badges</h4>
              <div className='flex flex-wrap gap-2'>
                <Badge
                  status='featured'
                  statusConfig={customStatusConfig}
                  variant='filled'
                >
                  Featured
                </Badge>
                <Badge
                  status='featured'
                  statusConfig={customStatusConfig}
                  variant='outlined'
                >
                  Featured
                </Badge>
                <Badge
                  status='featured'
                  statusConfig={customStatusConfig}
                  variant='pastel'
                >
                  Featured
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Status with Color Override */}
      <Card>
        <CardContent className='pt-6'>
          <CardTitle>Custom Status with Color Override</CardTitle>
          <p className='text-muted-foreground mb-4'>
            Use custom status text with predefined color schemes
          </p>
          <div className='flex flex-wrap gap-2'>
            <Badge status='awaiting approval' colorStatus='pending'>
              Awaiting approval
            </Badge>
            <Badge status='in review' colorStatus='pending'>
              In review
            </Badge>
            <Badge status='processing' colorStatus='pending'>
              Processing
            </Badge>
            <Badge status='on hold' colorStatus='error'>
              On hold
            </Badge>
            <Badge status='draft' colorStatus='neutral'>
              Draft
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Real-world Examples */}
      <Card>
        <CardContent className='pt-6'>
          <CardTitle>Real-world Examples</CardTitle>
          <p className='text-muted-foreground mb-4'>
            Real-world examples of badge usage
          </p>

          <div className='space-y-6'>
            <div>
              <h4 className='font-semibold mb-2'>User Roles</h4>
              <div className='flex flex-wrap gap-2'>
                <Badge status='success'>Admin</Badge>
                <Badge status='completed'>Moderator</Badge>
                <Badge status='neutral'>User</Badge>
                <Badge status='pending'>Guest</Badge>
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-2'>Order Status</h4>
              <div className='flex flex-wrap gap-2'>
                <Badge status='pending' icon={Clock}>
                  Processing
                </Badge>
                <Badge status='completed' icon={Info}>
                  Shipped
                </Badge>
                <Badge status='success' icon={CheckCircle}>
                  Delivered
                </Badge>
                <Badge status='success' icon={CheckCircle}>
                  Completed
                </Badge>
                <Badge status='error' icon={XCircle}>
                  Cancelled
                </Badge>
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-2'>Priority Levels</h4>
              <div className='flex flex-wrap gap-2'>
                <Badge status='neutral'>Low</Badge>
                <Badge status='pending'>Medium</Badge>
                <Badge status='error'>High</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
