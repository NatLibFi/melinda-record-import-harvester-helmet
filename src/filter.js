import moment from 'moment';

const EXCLUDED_MATERIAL_TYPES = [
  'd',
  'e',
  'q',
  '4',
  '6',
  'j',
  '7',
  'n',
  'f'
];

export default function (record, earliestCatalogTime) {
  const leader = record.varFields.find(f => f.fieldTag === '_');

  const materialType = getMaterialType();

  if (!materialType) {
    return false;
  }

  if (!checkLeader()) {
    return false;
  }

  if (!record.varFields.find(f => f.marcTag === '008')) {
    return false;
  }

  // Uncomment this to filter out records with 007 (For testing)
  /* if (record.varFields.find(f => f.marcTag === '007')) {
    return false;
  } */

  if (EXCLUDED_MATERIAL_TYPES.includes(materialType)) {
    return false;
  }

  if (isFromOverDrive()) {
    return false;
  }

  if (!record.catalogDate || !moment(record.catalogDate).isValid()) {
    return false;
  }

  if (earliestCatalogTime && moment(record.catalogDate).isBefore(earliestCatalogTime)) {
    return false;
  }

  return true;

  function getMaterialType() {
    if (record.materialType && record.materialType.code) {
      return record.materialType.code.trim();
    }
  }

  function checkLeader() {
    if (!leader) {
      return false;
    }

    if (leader.content[17] !== '4') {
      return false;
    }

    if (['c', 'd', 'j'].includes(leader.content[6])) {
      return false;
    }

    if (isMap()) {
      return false;
    }

    return true;

    function isMap() {
      return leader.content[6] === 'a' && record.varFields.some(f => {
        if (f.marcTag === '655') {
          const a = f.subfields.find(sf => sf.tag === 'a');

          if (a && a.content === 'kartastot') {
            return true;
          }
        }

        return false;
      });
    }
  }

  function isFromOverDrive() {
    const f037 = record.varFields.filter(f => f.marcTag === '037');
    const f710 = record.varFields.filter(f => f.marcTag === '710');

    return f037.some(match037) || f710.some(match710);

    function match037(f) {
      const b = f.subfields.find(sf => sf.tag === 'b' && (/^OverDrive/u).test(sf.content));
      const n = f.subfields.find(sf => sf.tag === 'n' && sf.content === 'http://www.overdrive.com');
      return b && n;
    }

    function match710(f) {
      return f.subfields.find(sf => sf.tag === 'a' && (/^overdrive/ui).test(sf.content));
    }
  }
}
