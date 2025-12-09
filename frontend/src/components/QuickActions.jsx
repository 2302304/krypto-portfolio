import React from 'react';

const QuickActions = () => {
  const actions = [
    {
      icon: '➕',
      title: 'Lisää transaktio',
      description: 'Kirjaa uusi osto tai myynti',
      link: '/transactions',
      color: 'from-blue-50 to-blue-100 border-blue-200 hover:shadow-blue-200'
    },
    {
      icon: '💼',
      title: 'Katso portfolio',
      description: 'Näytä omistukset ja kaaviot',
      link: '/portfolio',
      color: 'from-green-50 to-green-100 border-green-200 hover:shadow-green-200'
    },
    {
      icon: '📊',
      title: 'Markkinat',
      description: 'Selaa kryptovaluuttoja',
      link: '/market',
      color: 'from-purple-50 to-purple-100 border-purple-200 hover:shadow-purple-200'
    }
  ];

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Pikatyökalut</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.link}
            className={`p-4 bg-gradient-to-br ${action.color} border-2 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer`}
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
            <p className="text-xs text-gray-600">{action.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
