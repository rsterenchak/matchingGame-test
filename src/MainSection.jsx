import React from 'react';
import { useEffect, useState } from 'react';
import './style.css';
import homeBackground from './assets/kame-house.jpg'
import playBackground from './assets/namek-background.svg'
import HomePage from './HomePage.jsx'
import PlayPage from './PlayPage.jsx'
import homeSong from './assets/DragonBallZ.mp3'
import playSong from './assets/NamekTheme.mp3'

// process.env.DBZ_KEY;

// create component responsible for controlling music

function HandleHomeAudio({
  audioState

}){


  const audioElement = new Audio(homeSong);
  audioElement.volume = 0.07;
  audioElement.loop = true;
  let homeAudioSwitch = false;

  
  /** Start re-thinking how this will work once music is played
   *  Seems as though, upon render, this runs the effect, cleanup,
   *  and then finally the effect once more. Contstruct based on that
   * 
   */

  let cleanupMarker = true;

    useEffect(() => {

      cleanupMarker = true;
   

      var playPromise = audioElement.play();

      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Automatic playback started!
          
          // Show playing UI.
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
      }

      // console.log('useEffect - effect');

      cleanupMarker = false;

      return () => {


        // console.log('Cleanup for useEffect');

        audioElement.pause();



        
      };
    }, [audioState])


}

function HandlePauseAudio({
  audioState

}){


  const audioElement = new Audio(homeSong);
  audioElement.volume = 0.07;
  audioElement.loop = true;
  let homeAudioSwitch = false;


  
  /** Start re-thinking how this will work once music is played
   *  Seems as though, upon render, this runs the effect, cleanup,
   *  and then finally the effect once more. Contstruct based on that
   * 
   */

  let cleanupMarker = true;

    useEffect(() => {

      cleanupMarker = true;
   

      var playPromise = audioElement.pause();

      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Automatic playback started!
          // Show playing UI.
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
      }

      // console.log('useEffect - effect');

      cleanupMarker = false;

      return () => {


        // console.log('Cleanup for useEffect');


        
      };
    }, [audioState])


}

function HandlePlayAudio({
  audioState

}){


  const audioElement2 = new Audio(playSong);
  audioElement2.volume = 0.07;
  audioElement2.currentTime = 1;
  audioElement2.loop = true;
  let playAudioSwitch = false;

  
  /** Start re-thinking how this will work once music is played
   *  Seems as though, upon render, this runs the effect, cleanup,
   *  and then finally the effect once more. Contstruct based on that
   * 
   */

  let cleanupMarker = true;

    useEffect(() => {

      cleanupMarker = true;
   

      var playPromise = audioElement2.play();

      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Automatic playback started!
          
          // Show playing UI.
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
      }

      // console.log('Play - useEffect');

      cleanupMarker = false;

      return () => {


        // console.log('Play - cleanup');

        audioElement2.pause();



        
      };
    }, [audioState])


}

function HandlePausePlayAudio({
  audioState

}){


  const audioElement2 = new Audio(playSong);
  audioElement2.volume = 0.07;
  audioElement2.loop = true;
  let playAudioSwitch = false;

  
  /** Start re-thinking how this will work once music is played
   *  Seems as though, upon render, this runs the effect, cleanup,
   *  and then finally the effect once more. Contstruct based on that
   * 
   */

  let cleanupMarker = true;

    useEffect(() => {

      cleanupMarker = true;
   

      var playPromise = audioElement2.pause();

      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Automatic playback started!
          // Show playing UI.
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
      }

      // console.log('PlayPause - useEffect');

      cleanupMarker = false;

      return () => {


        // console.log('PlayPause - cleanup');


        
      };
    }, [audioState])


}



export default function MainSection() {

  const pulledData = [
    {
        "id": 1,
        "name": "Goku",
        "ki": "60.000.000",
        "maxKi": "90 Septillion",
        "race": "Saiyan",
        "gender": "Male",
        "description": "El protagonista de la serie, conocido por su gran poder y personalidad amigable. Originalmente enviado a la Tierra como un infante volador con la misión de conquistarla. Sin embargo, el caer por un barranco le proporcionó un brutal golpe que si bien casi lo mata, este alteró su memoria y anuló todos los instintos violentos de su especie, lo que lo hizo crecer con un corazón puro y bondadoso, pero conservando todos los poderes de su raza. No obstante, en la nueva continuidad de Dragon Ball se establece que él fue enviado por sus padres a la Tierra con el objetivo de sobrevivir a toda costa a la destrucción de su planeta por parte de Freeza. Más tarde, Kakarot, ahora conocido como Son Goku, se convertiría en el príncipe consorte del monte Fry-pan y líder de los Guerreros Z, así como el mayor defensor de la Tierra y del Universo 7, logrando mantenerlos a salvo de la destrucción en innumerables ocasiones, a pesar de no considerarse a sí mismo como un héroe o salvador.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699044374/hlpy6q013uw3itl5jzic.webp",
        "affiliation": "Z Fighter",
        "deletedAt": null
    },
    {
        "id": 2,
        "name": "Vegeta",
        "ki": "54.000.000",
        "maxKi": "19.84 Septillion",
        "race": "Saiyan",
        "gender": "Male",
        "description": "Príncipe de los Saiyans, inicialmente un villano, pero luego se une a los Z Fighters. A pesar de que a inicios de Dragon Ball Z, Vegeta cumple un papel antagónico, poco después decide rebelarse ante el Imperio de Freeza, volviéndose un aliado clave para los Guerreros Z. Con el paso del tiempo llegaría a cambiar su manera de ser, optando por permanecer y vivir en la Tierra para luchar a su lado contra las inminentes adversidades que superar. Junto con Piccolo, él es de los antiguos enemigos de Goku que ha evolucionando al pasar de ser un villano y antihéroe, a finalmente un héroe a lo largo del transcurso de la historia, convirtiéndose así en el deuteragonista de la serie.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699044422/i9hpfjplth6gjudvhsx3.webp",
        "affiliation": "Z Fighter",
        "deletedAt": null
    },
    {
        "id": 3,
        "name": "Piccolo",
        "ki": "2.000.000",
        "maxKi": "500.000.000",
        "race": "Namekian",
        "gender": "Male",
        "description": "Es un namekiano que surgió tras ser creado en los últimos momentos de vida de su padre, siendo su actual reencarnación. Aunque en un principio fue el archienemigo de Son Goku, con el paso del tiempo fue haciéndose menos malvado hasta finalmente convertirse en un ser bondadoso y miembro de los Guerreros Z. A través del tiempo, también comenzó a tomarle cariño a su discípulo Son Gohan, a quien veía como una especie de \"vástago\" y formando un lazo de amistad con este.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699044481/u9fhpc9smihu2kud3cuc.webp",
        "affiliation": "Z Fighter",
        "deletedAt": null
    },
    {
        "id": 4,
        "name": "Bulma",
        "ki": "0",
        "maxKi": "0",
        "race": "Human",
        "gender": "Female",
        "description": "Bulma es la protagonista femenina de la serie manga Dragon Ball y sus adaptaciones al anime Dragon Ball, Dragon Ball Z, Dragon Ball Super y Dragon Ball GT. Es hija del Dr. Brief y su esposa Panchy, hermana menor de Tights y una gran amiga de Son Goku con quien inicia la búsqueda de las Esferas del Dragón. En Dragon Ball Z tuvo a Trunks, primogénito de quien sería su esposo Vegeta, a su hija Bra[3] y su hijo adulto del tiempo alterno Trunks del Futuro Alternativo.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699044496/bifhe9qarbrgvm0tsiru.webp",
        "affiliation": "Z Fighter",
        "deletedAt": null
    },
    {
        "id": 5,
        "name": "Freezer",
        "ki": "530.000",
        "maxKi": "52.71 Septillion",
        "race": "Frieza Race",
        "gender": "Male",
        "description": "Freezer es el tirano espacial y el principal antagonista de la saga de Freezer.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699044513/ux3n5u0tjdvysjao4w8s.webp",
        "affiliation": "Army of Frieza",
        "deletedAt": null
    },
    {
        "id": 6,
        "name": "Zarbon",
        "ki": "20.000",
        "maxKi": "30.000",
        "race": "Frieza Race",
        "gender": "Male",
        "description": "Zarbon es uno de los secuaces de Freezer y un luchador poderoso.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699044531/jcdgte2shoaj2jh0ruob.webp",
        "affiliation": "Army of Frieza",
        "deletedAt": null
    },
    {
        "id": 7,
        "name": "Dodoria",
        "ki": "18.000",
        "maxKi": "20.000",
        "race": "Frieza Race",
        "gender": "Male",
        "description": "Dodoria es otro secuaz de Freezer conocido por su brutalidad.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699044548/m2mixyphepp8qwcigb3g.webp",
        "affiliation": "Army of Frieza",
        "deletedAt": null
    },
    {
        "id": 8,
        "name": "Ginyu",
        "ki": "9.000",
        "maxKi": "25.000",
        "race": "Frieza Race",
        "gender": "Male",
        "description": "Ginyu es el líder del la élite de mercenarios de mayor prestigio del Ejército de Freeza, la cual lleva el nombre de Fuerzas Especiales Ginew en su honor[9].",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699129673/dxsl3rjhrfmajo2gealz.webp",
        "affiliation": "Army of Frieza",
        "deletedAt": null
    },
    {
        "id": 9,
        "name": "Celula",
        "ki": "250.000.000",
        "maxKi": "5 Billion",
        "race": "Android",
        "gender": "Male",
        "description": "Cell conocido como Célula en España, es un bioandroide creado por la computadora del Dr. Gero, quien vino del futuro de la línea 3 con la intención de vengarse de Goku por haber acabado con el Ejército del Listón Rojo, y con ello el sueño de todo villano: dominar el mundo. Es el antagonista principal del Arco de los Androides y Cell.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699044573/mz09ghskyzf0skprredi.webp",
        "affiliation": "Freelancer",
        "deletedAt": null
    },
    {
        "id": 10,
        "name": "Gohan",
        "ki": "45.000.000",
        "maxKi": "40 septillion",
        "race": "Saiyan",
        "gender": "Male",
        "description": "Son Gohanda en su tiempo en España, o simplemente Gohan en Hispanoamérica, es uno de los personajes principales de los arcos argumentales de Dragon Ball Z, Dragon Ball Super y Dragon Ball GT. Es un mestizo entre saiyano y humano terrícola. Es el primer hijo de Son Goku y Chi-Chi, hermano mayor de Son Goten, esposo de Videl y padre de Pan.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699044627/kigekwjt2m8nwopgvabv.webp",
        "affiliation": "Z Fighter",
        "deletedAt": null
    },
    {
        "id": 11,
        "name": "Krillin",
        "ki": "1.000.000",
        "maxKi": "1 Billion",
        "race": "Human",
        "gender": "Male",
        "description": "Amigo cercano de Goku y guerrero valiente, es un personaje del manga y anime de Dragon Ball. Es uno de los principales discípulos de Kame-Sen'nin, Guerrero Z, y el mejor amigo de Son Goku. Es junto a Bulma uno de los personajes de apoyo principales de Dragon Ball, Dragon Ball Z y Dragon Ball Super. Aparece en Dragon Ball GT como personaje secundario. En el Arco de Majin Boo, se retira de las artes marciales, optando por formar una familia, como el esposo de la Androide Número 18 y el padre de Marron.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699046768/ay2b4ps6xc5i4uhcxoio.webp",
        "affiliation": "Z Fighter",
        "deletedAt": null
    },
    {
        "id": 12,
        "name": "Tenshinhan",
        "ki": "2.400.000",
        "maxKi": "80.000.000",
        "race": "Human",
        "gender": "Male",
        "description": "Maestro de las artes marciales y miembro de los Z Fighters.  Es un personaje que aparece en el manga y en el anime de Dragon Ball, Dragon Ball Z, Dragon Ball GT y posteriormente en Dragon Ball Super.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699046784/umcprk7ugb5q8cb9uhrh.webp",
        "affiliation": "Z Fighter",
        "deletedAt": null
    },
    {
        "id": 13,
        "name": "Yamcha",
        "ki": "1.980.000",
        "maxKi": "4.000.000",
        "race": "Human",
        "gender": "Male",
        "description": "Luchador que solía ser un bandido del desierto.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699047468/euprvykftdyup1uw6z4p.webp",
        "affiliation": "Z Fighter",
        "deletedAt": null
    },
    {
        "id": 14,
        "name": "Chi-Chi",
        "ki": "0",
        "maxKi": "0",
        "race": "Human",
        "gender": "Female",
        "description": "Esposa de Goku y madre de Gohan. Es la princesa del Monte Fry-pan siendo la hija de la fallecida reina de esta montaña y el Rey Gyuma, ella terminaría conociendo a Son Goku cuando era tan solo una niña para años más tarde durante su adolescencia ser su esposa y convertirse en la estricta pero amorosa madre de Gohan y Goten.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699046815/rizrttygnvfwv4gntrkw.webp",
        "affiliation": "Z Fighter",
        "deletedAt": null
    },
    {
        "id": 15,
        "name": "Gotenks",
        "ki": "65.600.000",
        "maxKi": "34.8 Billion",
        "race": "Saiyan",
        "gender": "Male",
        "description": " Gotenks también conocido inicialmente como Gotrunk en el doblaje al español de España, es el resultado de la Danza de la Fusión llevada a cabo correctamente por Goten y Trunks.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699046837/sfc007ookoxjac1j0mkl.webp",
        "affiliation": "Z Fighter",
        "deletedAt": null
    },
    {
        "id": 16,
        "name": "Trunks",
        "ki": "50.000.000",
        "maxKi": "37.4 septllion",
        "race": "Saiyan",
        "gender": "Male",
        "description": "Hijo de Vegeta y Bulma. Es un mestizo entre humano terrícola y Saiyano nacido en la Tierra, e hijo de Bulma y Vegeta, el cual es introducido en el Arco de los Androides y Cell. Más tarde en su vida como joven, se termina convirtiendo en un luchador de artes marciales, el mejor amigo de Son Goten y en el hermano mayor de su hermana Bra.",
        "image": "https://res.cloudinary.com/dgtgbyo76/image/upload/v1699046959/qmzg7t9u7nhmsqlpt83o.webp",
        "affiliation": "Z Fighter",
        "deletedAt": null
    }
]

  const [isCurrentPage, setCurrentPage] = useState(true);
  const [isCurrentAudio, setCurrentAudio] = useState(false);

  const [activeData, setActiveData] = useState([]);

  async function fetchData() {
    let url = 'https://dragonball-api.com/api/characters?page=1&limit=16';
    // let url = process.env.DBZ_KEY;

    // issue getting new fetch calls

    try {
      let response = await fetch(url, {mode: 'cors'});
    

      if(!response.ok){
      
        throw new Error(`HTTP error! Status: ${response.status}`);
      
      }

      let forecast = await response.json();
      setActiveData(forecast.items);

      console.log(forecast.items);
        } 

    catch(err) {

      console.log(err);


    }

  }

   useEffect(() => {

    console.log('Runs effect');

    fetchData();   

  }, [])



  return (
    

    <>

    {isCurrentPage ? (

       isCurrentAudio ? (
      
        <HandleHomeAudio
          audioState={isCurrentAudio}
        />
      ) : (

        <HandlePauseAudio
          audioState={isCurrentAudio}
        />

      )
       
    
      ) : (

        isCurrentAudio ? (
      
          <HandlePlayAudio
            audioState={isCurrentAudio}
          />
        ) : (
  
          <HandlePausePlayAudio
            audioState={isCurrentAudio}
          />
  
        )

      )}

        

    {isCurrentPage ? (
    
      <HomePage 
        background={homeBackground}
        setPlayPage={() => setCurrentPage(false)}
        setAudioPause={() => setCurrentAudio(false)}
        setAudioPlay={() => setCurrentAudio(true)}
        activeCurrentAudio={isCurrentAudio}
      />
      
      ) : (
      
      <PlayPage
        background={playBackground}
        setHomePage={() => setCurrentPage(true)}
        setAudioPause={() => setCurrentAudio(false)}
        setAudioPlay={() => setCurrentAudio(true)}
        activeCurrentAudio={isCurrentAudio}
        isActiveData={activeData}
      />  
    )}



    </>
    
  );
}




/*       // when page is true set/play homeSong
      if(isCurrentPage === true){

        console.log('isCurrentPage is true');

        homeAudioSwitch = !homeAudioSwitch;

        if(homeAudioSwitch){
    
          audioElement2.pause();
          audioElement2.currentTime = 0;        
          audioElement.play();
    
        }
        else{
    
          audioElement.pause();
          audioElement.currentTime = 0;
    
        }


      }

      // when page is false set/play playSong
      if(isCurrentPage === false){

        console.log('isCurrentPage is false');

        playAudioSwitch = !playAudioSwitch;

        if(playAudioSwitch){
    
          audioElement.pause();
          audioElement.currentTime = 0;
          audioElement2.play();
    
        }
        else{
    
          audioElement2.pause();
          audioElement2.currentTime = 0;
    
        }


      }   
 */


