import styles from './index.module.css';

export default function Recipe({ name, id, canonicalUrl, imageUrl, votes, onVote }) {
  return (
    <div className={styles.recipe}>
      <img className={styles.image} src={imageUrl} alt={`Image of ${name}`}/>
      <h3 className={styles.name}>
        <a href={canonicalUrl}>{name}</a>
      </h3>
      <div className={styles.graph}>
        <div className={styles.value}>{votes}</div>
        <div className={styles.bar}>
          <div className={styles.innerBar}>
          </div>
        </div>
      </div>fa
      <button className={styles.button} onClick={(e) => onVote(e, id)}>Vote!</button>
    </div>
  )
}
