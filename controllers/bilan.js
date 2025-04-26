import Bilan from '../models/Bilans.js'; // ⬅️ nécessite l'extension .js si tu utilises "type": "module" dans package.json

import ExcelJS from 'exceljs';
import path from "path";
import fs from 'fs';
import axios from 'axios';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const generateBilan = async (req, res) => {
  const { project_id } = req.query;
  if (!project_id) return res.status(400).json({ error: "Le project_id est requis" });

  try {
    const response = await axios.get(`http://localhost:5000/generate-bilan?project_id=${project_id}`);
    res.json(response.data);
  } catch (error) {
    console.error("Erreur lors de l'appel à Flask :", error.message);
    res.status(500).json({ error: "Erreur lors de la récupération du bilan" });
  }
};

export const saveBilan = async (req, res) => {
  const { projectId, bilanData } = req.body;
  if (!projectId || !bilanData) {
    return res.status(400).json({ error: 'Project ID et Bilan Data sont requis.' });
  }

  try {
    const existingBilan = await Bilan.findOne({ projectId });

    if (existingBilan) {
      if (JSON.stringify(existingBilan.bilanData) === JSON.stringify(bilanData)) {
        return res.status(409).json({ error: 'Un bilan identique existe déjà pour ce projectId.' });
      }

      existingBilan.bilanData = bilanData;
      existingBilan.createdAt = new Date();
      await existingBilan.save();

      return res.status(200).json({ message: 'Bilan mis à jour avec succès.', bilan: existingBilan });
    }

    const newBilan = new Bilan({ projectId, bilanData, createdAt: new Date() });
    await newBilan.save();

    res.status(201).json({ message: 'Bilan enregistré avec succès.', bilan: newBilan });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error.message);
    res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement du bilan.' });
  }
};

export const exportBilanExcel = async (req, res) => {
  try {
    const { projectId } = req.params;
    const bilan = await Bilan.findOne({ projectId }).lean();

    if (!bilan) return res.status(404).json({ error: 'Bilan non trouvé' });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bilan Comptable');

    // Styles
    const headerStyle = {
      font: { bold: true, size: 12, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' } },
      alignment: { horizontal: 'center' },
      border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    };

    const categoryStyle = {
      font: { bold: true },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } }
    };

    const totalStyle = {
      font: { bold: true, italic: true },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
    };

    worksheet.columns = [
      { header: 'ACTIF', key: 'actifCategory', width: 35 },
      { header: 'Montant', key: 'actifAmount', width: 20 },
      { header: 'PASSIF', key: 'passifCategory', width: 35 },
      { header: 'Montant', key: 'passifAmount', width: 20 }
    ];

    worksheet.getRow(1).eachCell(cell => Object.assign(cell, { style: headerStyle }));

    const formatNumber = (num) => {
      if (num === undefined || num === null) return '';
      return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
    };

    const flattenBilan = (obj, level = 0) => {
      let rows = [];
      Object.entries(obj).forEach(([key, value]) => {
        const indent = '  '.repeat(level);
        if (typeof value === 'object' && value !== null && key !== 'TOTAL') {
          rows.push({ label: `${indent}${key}`, value: '' });
          rows = rows.concat(flattenBilan(value, level + 1));
          if (value.TOTAL !== undefined) {
            rows.push({ label: `${indent}TOTAL`, value: formatNumber(value.TOTAL), isTotal: true });
          }
        } else if (key !== 'TOTAL') {
          rows.push({ label: `${indent}${key}`, value: formatNumber(value) });
        }
      });
      return rows;
    };

    const actifRows = flattenBilan(bilan.bilanData.ACTIF);
    const passifRows = flattenBilan(bilan.bilanData.PASSIF);
    const maxRows = Math.max(actifRows.length, passifRows.length);

    for (let i = 0; i < maxRows; i++) {
      const actif = actifRows[i] || { label: '', value: '' };
      const passif = passifRows[i] || { label: '', value: '' };
      const row = worksheet.addRow({
        actifCategory: actif.label,
        actifAmount: actif.value,
        passifCategory: passif.label,
        passifAmount: passif.value
      });

      row.eachCell(cell => {
        cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
      });

      if (actif.isTotal) {
        row.getCell(1).fill = totalStyle.fill;
        row.getCell(1).font = totalStyle.font;
        row.getCell(2).fill = totalStyle.fill;
        row.getCell(2).font = totalStyle.font;
      }

      if (passif.isTotal) {
        row.getCell(3).fill = totalStyle.fill;
        row.getCell(3).font = totalStyle.font;
        row.getCell(4).fill = totalStyle.fill;
        row.getCell(4).font = totalStyle.font;
      }

      if (actif.label && !actif.value && !actif.label.includes('TOTAL')) {
        row.getCell(1).fill = categoryStyle.fill;
        row.getCell(1).font = categoryStyle.font;
      }

      if (passif.label && !passif.value && !passif.label.includes('TOTAL')) {
        row.getCell(3).fill = categoryStyle.fill;
        row.getCell(3).font = categoryStyle.font;
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=bilan_${projectId}.xlsx`);
    res.send(buffer);
  } catch (error) {
    console.error('Erreur export Excel:', error);
    res.status(500).json({ error: 'Erreur lors de l\'export Excel' });
  }
};
export const getBilan = async (req, res) => {
  const projectId = req.params.projectId;  // Récupère `projectId` depuis les paramètres de la route
  console.log("Project ID reçu côté serveur:", projectId);

  if (!projectId) {
    return res.status(400).send({ error: 'Le projectId est manquant' });
  }

  console.log(`Requête reçue pour le projet ID: ${projectId}`); // Log côté serveur pour vérifier le projet

  try {
    // Recherche du bilan avec projectId comme chaîne de caractères
    const existingBilan = await Bilan.findOne({ projectId });

    // Si un bilan est trouvé, renvoyer les données du bilan
    if (existingBilan) {
      console.log('Bilan trouvé pour le projet:', existingBilan);  // Log pour vérifier les données
      return res.json({ exists: true, bilanData: existingBilan.bilanData });
    } else {
      console.log('Aucun bilan trouvé pour le projet');
      return res.json({ exists: false });  // Aucun bilan trouvé pour ce projectId
    }

  } catch (err) {
    console.error('Erreur lors de la récupération du bilan:', err);  // Log en cas d'erreur
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération du bilan.' });
  }
};