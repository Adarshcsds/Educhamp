const userTypes = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'parent', label: 'Parent' },
];

function UserTypeTabs({ activeType, onChange, label = 'Select account type' }) {
  return (
    <div className="user-tabs" role="tablist" aria-label={label}>
      {userTypes.map((type) => (
        <button
          key={type.value}
          type="button"
          role="tab"
          aria-selected={activeType === type.value}
          className={`user-tab ${activeType === type.value ? 'active' : ''}`}
          onClick={() => onChange(type.value)}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}

export default UserTypeTabs;
