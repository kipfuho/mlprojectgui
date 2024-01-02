import { useState, useEffect, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

const ParticleBackground = ({ linkColor }) => {
  const [ init, setInit ] = useState(false);

    // this should be run only once per application lifetime
  useEffect(() => {
      initParticlesEngine(async (engine) => {
          // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
          // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
          // starting from v2 you can add only the features you need reducing the bundle size
          //await loadAll(engine);
          //await loadFull(engine);
          await loadFull(engine);
          //await loadBasic(engine);
      }).then(() => {
          setInit(true);
      });
  }, []);

  const options = useMemo(() => {
    return {
      fpsLimit: 120,
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            area: 800
          }
        },
        color: {
          value: ["#2EB67D", "#ECB22E", "#E01E5B", "#36C5F0"]
        },
        shape: {
          type: "triangle"
        },
        opacity: {
          value: 0.3
        },
        size: {
          value: { min: 2, max: 5 }
        },
        links: {
          enable: true,
          distance: 150,
          color: linkColor,
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: false,
          straight: false,
          outModes: {
            default: "bounce",
          },
        }
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "attract"
          }
        },
        modes: {
          attract: {
            distance: 100,
            factor: 1
          }
        }
      },
      detectRetina: true,
    }
  }, [linkColor])

  return (
    <>
      {init && <Particles options={options} />}
    </>
  );
};

export default ParticleBackground;