import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';
import Transaction from '../models/Transaction.js';
import asyncHandler from '../utils/asyncHandler.js';

export const exportCSV = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = { user: req.user.id };
  
  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const transactions = await Transaction.find(query)
    .populate('category', 'name')
    .populate('wallet', 'name')
    .sort({ date: -1 });

  const data = transactions.map(t => ({
    Date: t.date.toISOString().split('T')[0],
    Type: t.type,
    Amount: (t.amount / 100).toFixed(2),
    Category: t.category ? t.category.name : '-',
    Wallet: t.wallet ? t.wallet.name : '-',
    Note: t.note || ''
  }));

  const parser = new Parser();
  const csv = parser.parse(data);

  res.header('Content-Type', 'text/csv');
  res.attachment('expensecap_transactions.csv');
  return res.send(csv);
});

export const exportExcel = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = { user: req.user.id };
  
  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const transactions = await Transaction.find(query)
    .populate('category', 'name')
    .populate('wallet', 'name')
    .sort({ date: -1 });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Transactions');

  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Type', key: 'type', width: 10 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Wallet', key: 'wallet', width: 20 },
    { header: 'Note', key: 'note', width: 30 }
  ];

  transactions.forEach(t => {
    worksheet.addRow({
      date: t.date.toISOString().split('T')[0],
      type: t.type,
      amount: t.amount / 100,
      category: t.category ? t.category.name : '-',
      wallet: t.wallet ? t.wallet.name : '-',
      note: t.note || ''
    });
  });

  res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.attachment('expensecap_transactions.xlsx');
  
  await workbook.xlsx.write(res);
  res.end();
});
