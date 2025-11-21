'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VINFullReport } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'
import {
  AlertTriangle,
  Shield,
  FileText,
  Users,
  Gauge,
  Wrench,
  DollarSign,
  Download,
  CheckCircle,
  XCircle,
  Camera,
  Calendar,
  MapPin,
} from 'lucide-react'
import { generatePDF } from '@/lib/pdf'

interface PaidReportProps {
  report: VINFullReport
  vin: string
}

export default function PaidReport({ report, vin }: PaidReportProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generatePDF(report, vin)
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Vehicle Image - Prominently Displayed */}
      {report.basicInfo.imageUrl && (
        <Card className="overflow-hidden border-2 border-blue-200 shadow-lg">
          <div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-blue-50 to-gray-100">
            <img
              src={report.basicInfo.imageUrl}
              alt={`${report.basicInfo.year || ''} ${report.basicInfo.make || ''} ${report.basicInfo.model || ''}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&q=80'
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {report.basicInfo.year && `${report.basicInfo.year} `}
                  {report.basicInfo.make && `${report.basicInfo.make} `}
                  {report.basicInfo.model}
                </h2>
                {report.basicInfo.trim && (
                  <p className="text-blue-100 text-base md:text-lg font-medium">{report.basicInfo.trim}</p>
                )}
                <p className="text-white/80 text-sm mt-2">VIN: {vin}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Header with Download */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Complete Vehicle Report</h1>
          <p className="text-muted-foreground">VIN: {vin}</p>
        </div>
        <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
          {isGeneratingPDF ? (
            'Generating...'
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      {/* Actual Vehicle Photos from Records */}
      {report.basicInfo.photos && report.basicInfo.photos.length > 0 && (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {report.basicInfo.photos.map((photo, index) => (
                <div key={index} className="space-y-2">
                  <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-gray-200 group cursor-pointer">
                    <img
                      src={photo.url}
                      alt={`Vehicle photo from ${photo.source} - ${photo.date || 'unknown date'}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&q=80'
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-black/70 text-white text-xs px-2 py-1 rounded capitalize">
                        {photo.source}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {photo.date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Taken: {formatDate(photo.date)}</span>
                      </div>
                    )}
                    {photo.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{photo.location}</span>
                      </div>
                    )}
                    {photo.description && (
                      <p className="text-sm text-gray-700 mt-2">{photo.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.basicInfo.year && (
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="text-lg font-semibold">{report.basicInfo.year}</p>
              </div>
            )}
            {report.basicInfo.make && (
              <div>
                <p className="text-sm text-muted-foreground">Make</p>
                <p className="text-lg font-semibold">{report.basicInfo.make}</p>
              </div>
            )}
            {report.basicInfo.model && (
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="text-lg font-semibold">{report.basicInfo.model}</p>
              </div>
            )}
            {report.basicInfo.trim && (
              <div>
                <p className="text-sm text-muted-foreground">Trim</p>
                <p className="text-lg font-semibold">{report.basicInfo.trim}</p>
              </div>
            )}
            {report.basicInfo.bodyClass && (
              <div>
                <p className="text-sm text-muted-foreground">Body Type</p>
                <p className="text-lg font-semibold">{report.basicInfo.bodyClass}</p>
              </div>
            )}
            {report.basicInfo.fuelType && (
              <div>
                <p className="text-sm text-muted-foreground">Fuel Type</p>
                <p className="text-lg font-semibold">{report.basicInfo.fuelType}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Red Flags Summary */}
      {(report.hasAccidents || report.hasSalvageTitle || report.hasTheftRecord || report.multipleOwners) && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Red Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.hasAccidents && (
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold">Accident History Found</span>
                </div>
              )}
              {report.hasSalvageTitle && (
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold">Salvage Title</span>
                </div>
              )}
              {report.hasTheftRecord && (
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold">Theft Record</span>
                </div>
              )}
              {report.multipleOwners && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold">Multiple Owners ({report.ownerCount})</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accidents */}
      {report.hasAccidents && report.accidents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Accident History ({report.accidents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.accidents.map((accident, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{formatDate(accident.date)}</p>
                      <p className="text-sm text-muted-foreground">{accident.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      accident.severity === 'severe' || accident.severity === 'totaled'
                        ? 'bg-red-100 text-red-700'
                        : accident.severity === 'moderate'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {accident.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm">{accident.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Title Brands */}
      {report.titleBrands.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              Title Brands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {report.titleBrands.map((brand, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-orange-50 rounded">
                  <div>
                    <p className="font-semibold capitalize">{brand.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(brand.date)} • {brand.state}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ownership History */}
      {report.ownershipHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Ownership History ({report.ownerCount} owners)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.ownershipHistory.map((owner, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Owner #{owner.ownerNumber}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {owner.ownerType} • {owner.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>Purchased: {formatDate(owner.purchaseDate)}</p>
                    {owner.saleDate && (
                      <p>Sold: {formatDate(owner.saleDate)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Odometer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-purple-600" />
            Odometer Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              {report.odometerReading ? (
                <p className="text-2xl font-bold">{report.odometerReading.toLocaleString()} km</p>
              ) : (
                <p className="text-lg text-muted-foreground">Not available</p>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              report.odometerStatus === 'normal'
                ? 'bg-green-100 text-green-700'
                : report.odometerStatus === 'rollback'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {report.odometerStatus.toUpperCase()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service History */}
      {report.serviceHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-green-600" />
              Service History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.serviceHistory.map((service, index) => (
                <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold">{service.serviceType}</p>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(service.date)} • {service.mileage.toLocaleString()} km
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Value */}
      {report.estimatedValue && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Estimated Market Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(report.estimatedValue)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Based on vehicle history and current market conditions
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recalls */}
      {report.recalls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              Safety Recalls ({report.recalls.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.recalls.map((recall, index) => (
                <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold mb-1">
                    Campaign #{recall.NHTSACampaignNumber}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Component: {recall.Component}
                  </p>
                  <p className="text-sm mb-2">{recall.Summary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

