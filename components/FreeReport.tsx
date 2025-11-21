'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VINFreeReport } from '@/types'
import { formatDate } from '@/lib/utils'
import { AlertTriangle, Shield, FileText, Camera, Calendar, MapPin } from 'lucide-react'
import PricingCards from './PricingCards'

interface FreeReportProps {
  report: VINFreeReport
  vin: string
}

export default function FreeReport({ report, vin }: FreeReportProps) {
  const { basicInfo, recalls } = report

  return (
    <div className="space-y-6">
      {/* Vehicle Image - Prominently Displayed */}
      {basicInfo.imageUrl && (
        <Card className="overflow-hidden border-2 border-blue-200 shadow-lg">
          <div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-blue-50 to-gray-100">
            <img
              src={basicInfo.imageUrl}
              alt={`${basicInfo.year || ''} ${basicInfo.make || ''} ${basicInfo.model || ''}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement
                target.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&q=80'
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {basicInfo.year && `${basicInfo.year} `}
                  {basicInfo.make && `${basicInfo.make} `}
                  {basicInfo.model}
                </h2>
                {basicInfo.trim && (
                  <p className="text-blue-100 text-base md:text-lg font-medium">{basicInfo.trim}</p>
                )}
                <p className="text-white/80 text-sm mt-2">VIN: {vin}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Vehicle Information</CardTitle>
          <CardDescription>Basic details for VIN: {vin}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {basicInfo.year && (
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="text-lg font-semibold">{basicInfo.year}</p>
              </div>
            )}
            {basicInfo.make && (
              <div>
                <p className="text-sm text-muted-foreground">Make</p>
                <p className="text-lg font-semibold">{basicInfo.make}</p>
              </div>
            )}
            {basicInfo.model && (
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="text-lg font-semibold">{basicInfo.model}</p>
              </div>
            )}
            {basicInfo.trim && (
              <div>
                <p className="text-sm text-muted-foreground">Trim</p>
                <p className="text-lg font-semibold">{basicInfo.trim}</p>
              </div>
            )}
            {basicInfo.bodyClass && (
              <div>
                <p className="text-sm text-muted-foreground">Body Type</p>
                <p className="text-lg font-semibold">{basicInfo.bodyClass}</p>
              </div>
            )}
            {basicInfo.fuelType && (
              <div>
                <p className="text-sm text-muted-foreground">Fuel Type</p>
                <p className="text-lg font-semibold">{basicInfo.fuelType}</p>
              </div>
            )}
            {basicInfo.engineModel && (
              <div>
                <p className="text-sm text-muted-foreground">Engine</p>
                <p className="text-lg font-semibold">{basicInfo.engineModel}</p>
              </div>
            )}
            {basicInfo.plantCountry && (
              <div>
                <p className="text-sm text-muted-foreground">Manufactured In</p>
                <p className="text-lg font-semibold">{basicInfo.plantCountry}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actual Vehicle Photos from Records */}
      {basicInfo.photos && basicInfo.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              Vehicle Photos from Records
            </CardTitle>
            <CardDescription>
              Actual photos taken by insurance companies, service centers, and inspection stations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {basicInfo.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={photo.url}
                      alt={`Vehicle photo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&q=80'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-xs">
                        {photo.date && (
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(photo.date)}</span>
                          </div>
                        )}
                        {photo.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{photo.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700 capitalize">
                        {photo.source === 'insurance' && '🏥 Insurance'}
                        {photo.source === 'service' && '🔧 Service Center'}
                        {photo.source === 'inspection' && '✅ Inspection'}
                        {photo.source === 'accident' && '⚠️ Accident'}
                        {photo.source === 'auction' && '🔨 Auction'}
                        {photo.source === 'dealer' && '🏪 Dealer'}
                        {photo.source === 'other' && '📷 Other'}
                      </span>
                      {photo.date && (
                        <span className="text-xs text-gray-500">
                          {new Date(photo.date).getFullYear()}
                        </span>
                      )}
                    </div>
                    {photo.description && (
                      <p className="text-xs text-gray-600 mt-1">{photo.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              🔒 Unlock full report to see all photos and detailed history
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recalls Card */}
      {recalls && recalls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Safety Recalls ({recalls.length})
            </CardTitle>
            <CardDescription>Important safety information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recalls.map((recall, index) => (
                <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold mb-1">
                    Campaign #{recall.NHTSACampaignNumber}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Component: {recall.Component}
                  </p>
                  <p className="text-sm mb-2">{recall.Summary}</p>
                  {recall.Consequence && (
                    <p className="text-sm text-red-600 mb-1">
                      <strong>Consequence:</strong> {recall.Consequence}
                    </p>
                  )}
                  {recall.Remedy && (
                    <p className="text-sm text-green-600">
                      <strong>Remedy:</strong> {recall.Remedy}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blurred Sections - Create Urgency */}
      <div className="space-y-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent blur-sm"></div>
          <div className="relative opacity-30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Accident History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </CardContent>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm font-semibold text-gray-600 bg-white/90 px-4 py-2 rounded">
              🔒 Unlock to view accident history
            </p>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent blur-sm"></div>
          <div className="relative opacity-30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Ownership History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </CardContent>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm font-semibold text-gray-600 bg-white/90 px-4 py-2 rounded">
              🔒 Unlock to view ownership history
            </p>
          </div>
        </Card>
      </div>

      {/* Payment Options */}
      <div className="mt-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Unlock Full Report</h2>
          <p className="text-muted-foreground">
            Get complete vehicle history including accidents, ownership, and more
          </p>
        </div>
        <PricingCards vin={vin} />
      </div>
    </div>
  )
}

