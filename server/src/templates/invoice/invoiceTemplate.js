/**
 * Invoice PDF template renderer using PDFKit.
 * Renders an official, beautifully styled civic service advance receipt.
 */

export const renderInvoicePdf = (doc, invoice, issue) => {
  const margin = 50;
  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const darkNavy = '#171A3B';
  const primaryViolet = '#7C3AED';
  const deepIndigo = '#312E81';
  const textDark = '#1E293B';
  const textMuted = '#64748B';
  const borderColor = '#E2E8F0';
  const softBg = '#F8F7FC';

  // Header Banner
  doc
    .fillColor(darkNavy)
    .fontSize(22)
    .font('Helvetica-Bold')
    .text('CROWD REPORT', margin, 50, { continued: true })
    .fillColor(primaryViolet)
    .text(' PLATFORM');

  doc
    .fillColor(textMuted)
    .fontSize(9)
    .font('Helvetica')
    .text('Decentralized Municipal Civic Issue Resolution System', margin, 76);

  // Right-aligned Invoice Header Details
  const invoiceTitle = invoice.type === 'Final' ? 'FINAL INVOICE' : 'ADVANCE RECEIPT';
  doc
    .fillColor(deepIndigo)
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(invoiceTitle, margin, 50, { align: 'right' });

  doc
    .fillColor(textMuted)
    .fontSize(9)
    .font('Helvetica')
    .text(`Invoice No: ${invoice.invoiceNumber}`, margin, 70, { align: 'right' })
    .text(
      `Date: ${new Date(invoice.createdAt || Date.now()).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}`,
      margin,
      83,
      { align: 'right' }
    )
    .text(`Status: COMPLETED (PAID)`, margin, 96, { align: 'right' });

  // Divider Line
  doc
    .strokeColor(borderColor)
    .lineWidth(1)
    .moveTo(margin, 115)
    .lineTo(pageWidth - margin, 115)
    .stroke();

  // Two Columns: Citizen Info & Issue Snapshot
  const colY = 130;
  const colWidth = (contentWidth - 20) / 2;

  // Billed To Column
  doc
    .fillColor(deepIndigo)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('BILLED TO (CITIZEN)', margin, colY);

  const customer = invoice.customerSnapshot || {};
  const addr = customer.address || {};
  const addrLine = [addr.street, addr.city, addr.pincode].filter(Boolean).join(', ') || 'N/A';

  doc
    .fillColor(textDark)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text(customer.name || 'Citizen User', margin, colY + 16);

  doc
    .fillColor(textMuted)
    .fontSize(9)
    .font('Helvetica')
    .text(`Email: ${customer.email || 'N/A'}`, margin, colY + 30)
    .text(`Phone: ${customer.phone || 'N/A'}`, margin, colY + 43)
    .text(`Address: ${addrLine}`, margin, colY + 56, { width: colWidth });

  // Issue Snapshot Column
  const rightColX = margin + colWidth + 20;
  doc
    .fillColor(deepIndigo)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('CIVIC ISSUE DETAILS', rightColX, colY);

  const issueCode = issue?.issueCode || 'N/A';
  const issueTitle = issue?.title || 'Civic Issue';
  const categoryName = invoice.feeBreakdown?.categoryName || 'General Civic';

  doc
    .fillColor(textDark)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text(`Ref: ${issueCode}`, rightColX, colY + 16);

  doc
    .fillColor(textMuted)
    .fontSize(9)
    .font('Helvetica')
    .text(`Category: ${categoryName}`, rightColX, colY + 30)
    .text(`Title: ${issueTitle}`, rightColX, colY + 43, { width: colWidth, lineBreak: false, ellipsis: true })
    .text(`Severity: ${invoice.feeBreakdown?.assessedSeverity || 'Medium'}`, rightColX, colY + 56);

  // Table Header
  const tableY = 220;
  doc
    .rect(margin, tableY, contentWidth, 24)
    .fillColor(softBg)
    .fill();

  doc
    .strokeColor(borderColor)
    .lineWidth(1)
    .rect(margin, tableY, contentWidth, 24)
    .stroke();

  doc
    .fillColor(deepIndigo)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('FEE COMPONENT / DESCRIPTION', margin + 12, tableY + 7)
    .text('CALCULATION DETAILS', margin + 240, tableY + 7)
    .text('AMOUNT (INR)', margin + contentWidth - 100, tableY + 7, { width: 90, align: 'right' });

  // Table Rows
  const breakdown = invoice.feeBreakdown || {};
  const baseFee = ((breakdown.categoryBaseFeePaise || 0) / 100).toFixed(2);
  const severityMultiplier = breakdown.severityMultiplier || 1.0;
  const adjustedBase = (((breakdown.categoryBaseFeePaise || 0) * severityMultiplier) / 100).toFixed(2);
  const distKm = breakdown.distanceKm || 0;
  const freeKm = breakdown.freeKm || 3;
  const billableKm = Math.max(0, distKm - freeKm).toFixed(1);
  const perKmRate = ((breakdown.perKmRatePaise || 0) / 100).toFixed(2);
  const distanceFee = ((breakdown.distanceFeePaise || 0) / 100).toFixed(2);

  const rows = [
    {
      title: 'Base Civic Service Fee',
      details: `${breakdown.categoryName || 'Standard'} base municipal rate`,
      amount: `₹${baseFee}`,
    },
    {
      title: 'Severity & Urgency Weight',
      details: `Multiplier: ${severityMultiplier}x (${breakdown.assessedSeverity || 'Assessed'})`,
      amount: `₹${adjustedBase}`,
    },
    {
      title: 'Distance Dispatch Fee',
      details: `${distKm} km (${billableKm} billable km @ ₹${perKmRate}/km)`,
      amount: `₹${distanceFee}`,
    },
  ];

  let currentY = tableY + 24;

  rows.forEach((row) => {
    doc
      .strokeColor(borderColor)
      .lineWidth(0.5)
      .moveTo(margin, currentY)
      .lineTo(margin + contentWidth, currentY)
      .stroke();

    doc
      .fillColor(textDark)
      .fontSize(9)
      .font('Helvetica')
      .text(row.title, margin + 12, currentY + 8)
      .fillColor(textMuted)
      .text(row.details, margin + 240, currentY + 8)
      .fillColor(textDark)
      .font('Helvetica-Bold')
      .text(row.amount, margin + contentWidth - 100, currentY + 8, { width: 90, align: 'right' });

    currentY += 28;
  });

  // Bottom Border of table
  doc
    .strokeColor(borderColor)
    .lineWidth(1)
    .moveTo(margin, currentY)
    .lineTo(margin + contentWidth, currentY)
    .stroke();

  // Summary Ledger Box (Right-aligned)
  const summaryBoxY = currentY + 20;
  const summaryBoxWidth = 240;
  const summaryBoxX = margin + contentWidth - summaryBoxWidth;

  const isFinal = invoice.type === 'Final';
  const totalFeeFormatted = ((breakdown.totalPaise || 0) / 100).toFixed(2);
  const advancePaidFormatted = ((invoice.advancePaidPaise || 0) / 100).toFixed(2);
  const balancePaidFormatted = isFinal
    ? ((invoice.amountPaidPaise || 0) / 100).toFixed(2)
    : '0.00';
  const balanceDueFormatted = isFinal
    ? '0.00'
    : ((invoice.balanceDuePaise || 0) / 100).toFixed(2);

  const boxHeight = isFinal ? 116 : 96;

  // Background Box
  doc
    .rect(summaryBoxX, summaryBoxY, summaryBoxWidth, boxHeight)
    .fillColor(softBg)
    .fill();

  doc
    .strokeColor(borderColor)
    .lineWidth(1)
    .rect(summaryBoxX, summaryBoxY, summaryBoxWidth, boxHeight)
    .stroke();

  // Total Quoted Service Fee
  doc
    .fillColor(textMuted)
    .fontSize(9)
    .font('Helvetica')
    .text('Total Service Fee:', summaryBoxX + 12, summaryBoxY + 12)
    .fillColor(textDark)
    .font('Helvetica-Bold')
    .text(`₹${totalFeeFormatted}`, summaryBoxX + 120, summaryBoxY + 12, { width: 108, align: 'right' });

  // Advance Paid
  doc
    .fillColor(primaryViolet)
    .font('Helvetica-Bold')
    .text(isFinal ? 'Advance Settled (Inv 1):' : 'Advance Paid (50%):', summaryBoxX + 12, summaryBoxY + 34)
    .text(`₹${advancePaidFormatted}`, summaryBoxX + 120, summaryBoxY + 34, { width: 108, align: 'right' });

  if (isFinal) {
    // Balance Paid
    doc
      .fillColor(primaryViolet)
      .font('Helvetica-Bold')
      .text('Balance Settled (Inv 2):', summaryBoxX + 12, summaryBoxY + 54)
      .text(`₹${balancePaidFormatted}`, summaryBoxX + 120, summaryBoxY + 54, { width: 108, align: 'right' });

    // Divider
    doc
      .strokeColor(borderColor)
      .lineWidth(0.5)
      .moveTo(summaryBoxX + 10, summaryBoxY + 74)
      .lineTo(summaryBoxX + summaryBoxWidth - 10, summaryBoxY + 74)
      .stroke();

    // Remaining Balance: 0.00
    doc
      .fillColor(deepIndigo)
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Remaining Balance:', summaryBoxX + 12, summaryBoxY + 86)
      .text('₹0.00 (PAID IN FULL)', summaryBoxX + 100, summaryBoxY + 86, { width: 128, align: 'right' });
  } else {
    // Divider
    doc
      .strokeColor(borderColor)
      .lineWidth(0.5)
      .moveTo(summaryBoxX + 10, summaryBoxY + 58)
      .lineTo(summaryBoxX + summaryBoxWidth - 10, summaryBoxY + 58)
      .stroke();

    // Balance Due Upon Resolution
    doc
      .fillColor(deepIndigo)
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Balance Due Upon Resolution:', summaryBoxX + 12, summaryBoxY + 68)
      .text(`₹${balanceDueFormatted}`, summaryBoxX + 140, summaryBoxY + 68, { width: 88, align: 'right' });
  }

  // Payment Verification Stamp / Badge
  const badgeY = currentY + 25;
  doc
    .roundedRect(margin, badgeY, 180, 50, 6)
    .strokeColor('#A78BFA')
    .lineWidth(1)
    .stroke();

  doc
    .fillColor(primaryViolet)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('PAYMENT VERIFIED', margin + 12, badgeY + 12);

  doc
    .fillColor(textMuted)
    .fontSize(8)
    .font('Helvetica')
    .text('Method: Mock Payment Simulator', margin + 12, badgeY + 25)
    .text(`Txn Ref: ${invoice._id}`, margin + 12, badgeY + 36);

  // Footer / Legal Disclaimer (Required by spec)
  const footerY = 700;
  doc
    .strokeColor(borderColor)
    .lineWidth(1)
    .moveTo(margin, footerY)
    .lineTo(pageWidth - margin, footerY)
    .stroke();

  doc
    .fillColor('#DC2626')
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('MOCK PAYMENT - not a tax invoice', margin, footerY + 10, { align: 'center' });

  doc
    .fillColor(textMuted)
    .fontSize(8)
    .font('Helvetica')
    .text(
      'This document is an electronically generated service receipt for simulation purposes on the Crowd Report Platform.',
      margin,
      footerY + 24,
      { align: 'center' }
    )
    .text(
      'No physical signature is required. For inquiries, contact operations@crowdreport.local',
      margin,
      footerY + 36,
      { align: 'center' }
    );
};

export default {
  renderInvoicePdf,
};
