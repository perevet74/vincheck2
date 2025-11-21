import React, { ReactElement } from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { VINFullReport } from '@/types'
import { formatDate, formatCurrency } from './utils'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #3B82F6',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    backgroundColor: '#F3F4F6',
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
    color: '#4B5563',
  },
  value: {
    width: '60%',
    color: '#111827',
  },
  redFlag: {
    backgroundColor: '#FEE2E2',
    padding: 8,
    marginBottom: 5,
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#6B7280',
    borderTop: '1 solid #E5E7EB',
    paddingTop: 10,
  },
})

export async function generatePDF(report: VINFullReport, vin: string) {
  const doc: ReactElement = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>camVIN Vehicle Report</Text>
          <Text style={styles.subtitle}>VIN: {vin}</Text>
          <Text style={styles.subtitle}>
            Generated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          {report.basicInfo.year && (
            <View style={styles.row}>
              <Text style={styles.label}>Year:</Text>
              <Text style={styles.value}>{report.basicInfo.year}</Text>
            </View>
          )}
          {report.basicInfo.make && (
            <View style={styles.row}>
              <Text style={styles.label}>Make:</Text>
              <Text style={styles.value}>{report.basicInfo.make}</Text>
            </View>
          )}
          {report.basicInfo.model && (
            <View style={styles.row}>
              <Text style={styles.label}>Model:</Text>
              <Text style={styles.value}>{report.basicInfo.model}</Text>
            </View>
          )}
          {report.basicInfo.trim && (
            <View style={styles.row}>
              <Text style={styles.label}>Trim:</Text>
              <Text style={styles.value}>{report.basicInfo.trim}</Text>
            </View>
          )}
        </View>

        {/* Red Flags */}
        {(report.hasAccidents || report.hasSalvageTitle || report.hasTheftRecord) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Red Flags</Text>
            {report.hasAccidents && (
              <View style={styles.redFlag}>
                <Text>⚠️ Accident History Found</Text>
              </View>
            )}
            {report.hasSalvageTitle && (
              <View style={styles.redFlag}>
                <Text>⚠️ Salvage Title</Text>
              </View>
            )}
            {report.hasTheftRecord && (
              <View style={styles.redFlag}>
                <Text>⚠️ Theft Record</Text>
              </View>
            )}
          </View>
        )}

        {/* Accidents */}
        {report.hasAccidents && report.accidents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accident History</Text>
            {report.accidents.map((accident, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text>
                  Date: {formatDate(accident.date)} | Severity: {accident.severity}
                </Text>
                <Text>Location: {accident.location}</Text>
                <Text>{accident.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Ownership */}
        {report.ownershipHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ownership History</Text>
            {report.ownershipHistory.map((owner, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text>Owner #{owner.ownerNumber} - {owner.ownerType}</Text>
                <Text>Purchased: {formatDate(owner.purchaseDate)}</Text>
                {owner.saleDate && <Text>Sold: {formatDate(owner.saleDate)}</Text>}
                <Text>Location: {owner.location}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Odometer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Odometer</Text>
          {report.odometerReading ? (
            <Text>{report.odometerReading.toLocaleString()} km - Status: {report.odometerStatus}</Text>
          ) : (
            <Text>Not available</Text>
          )}
        </View>

        {/* Market Value */}
        {report.estimatedValue && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estimated Market Value</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {formatCurrency(report.estimatedValue)}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>This report was generated by camVIN</Text>
          <Text>For questions, contact support@camairvin.com</Text>
        </View>
      </Page>
    </Document>
  )

  const blob = await pdf(doc).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `camVIN-Report-${vin}-${Date.now()}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

