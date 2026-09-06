import { PanoramicWay } from './PanoramicWay/PanoramicWay';

export const CardsSlider = () => {
  return (
    <section className='adventure-recommendations'>
      <div className='adventure-recommendations__header'>
        <h2 className='adventure-recommendations__title'>
          Zobacz niezwykłe miejsca
        </h2>
        <p className='adventure-recommendations__subtitle'>
          Wyselekcjonowane punkty na mapie, które zmieniają zwykłą podróż w
          legendę.
        </p>
      </div>
      <PanoramicWay />
    </section>
  );
};
