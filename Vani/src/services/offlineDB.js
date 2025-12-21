import enTree from '../assets/data/decision_tree_en.json';
import hiTree from '../assets/data/decision_tree_hi.json';
import bnTree from '../assets/data/decision_tree_bn.json';

const trees = {
  en: enTree,
  hi: hiTree,
  bn: bnTree,
};

export const getAllEmergencies = language => {
  return trees[language].emergencies;
};

export const getEmergencyById = (id, language) => {
  return trees[language].emergencies.find(item => item.id === id);
};

export const findEmergencyByKeyword = (text, language) => {
  const input = text.toLowerCase();

  return trees[language].emergencies.find(emergency => {
    let score = 0;

    emergency.keywords.forEach(keyword => {
      if (input.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });

    return score >= 2;
  });
};
