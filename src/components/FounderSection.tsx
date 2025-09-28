import { ScrollAnimatedSection } from "./ScrollAnimatedSection";
import matthewHeadshot from "@/assets/matthew-headshot.jpg";
import matthewTeaching from "@/assets/matthew-teaching.jpg";

export function FounderSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-background via-background/50 to-primary/5">
      <div className="container mx-auto px-6">
        <ScrollAnimatedSection animation="fade-up" delay={100}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Meet Our Founder
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Empowering communities through financial literacy and bridging the opportunity gap
            </p>
          </div>
        </ScrollAnimatedSection>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimatedSection animation="slide-right" delay={200}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-foreground">Matthew Kayden</h3>
                  <p className="text-xl text-primary font-semibold">Founder & CEO, LyticalPilot</p>
                </div>
                
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Matthew Kayden founded LyticalPilot with a powerful vision: to democratize access to financial 
                    knowledge and create pathways to economic empowerment for underserved communities.
                  </p>
                  
                  <p>
                    Growing up witnessing the stark disparities in financial literacy and access to investment 
                    opportunities, Matthew recognized that lack of financial education often perpetuates cycles 
                    of economic disadvantage. This realization ignited his passion for creating solutions that 
                    could level the playing field.
                  </p>
                  
                  <p>
                    Through LyticalPilot, Matthew is building more than just a financial platform—he's creating 
                    a bridge between complex market data and accessible learning tools. The platform combines 
                    sophisticated analytics with educational resources, making institutional-grade financial 
                    insights available to everyone, regardless of their economic background.
                  </p>
                  
                  <p>
                    "Financial literacy shouldn't be a privilege," Matthew believes. "It should be a fundamental 
                    right that opens doors to economic mobility and generational wealth building."
                  </p>
                </div>
                
                <div className="pt-4">
                  <div className="bg-card/50 border border-border/50 rounded-lg p-6">
                    <h4 className="font-semibold text-primary mb-3">Our Mission</h4>
                    <p className="text-sm text-muted-foreground">
                      To bridge the gap between the underprivileged and economic opportunities through 
                      comprehensive financial literacy education, accessible market insights, and tools 
                      that empower individuals to build sustainable wealth and achieve financial independence.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimatedSection>

            <ScrollAnimatedSection animation="slide-left" delay={300}>
              <div className="space-y-6">
                <div className="relative">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden border-4 border-primary/20 shadow-2xl">
                    <img 
                      src={matthewHeadshot} 
                      alt="Matthew Kayden, Founder of LyticalPilot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-gradient-primary rounded-xl p-3 shadow-lg">
                    <div className="text-white text-center">
                      <div className="text-2xl font-bold">500+</div>
                      <div className="text-xs opacity-90">Students Taught</div>
                    </div>
                  </div>
                </div>
                
                <div className="aspect-video rounded-xl overflow-hidden border-2 border-border/50 shadow-lg">
                  <img 
                    src={matthewTeaching} 
                    alt="Matthew Kayden teaching financial literacy to young students"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground italic">
                    "Education is the most powerful weapon which you can use to change the world" - Nelson Mandela
                  </p>
                </div>
              </div>
            </ScrollAnimatedSection>
          </div>
        </div>

        <ScrollAnimatedSection animation="fade-up" delay={400}>
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 max-w-4xl mx-auto">
              <h4 className="text-2xl font-bold mb-4 text-primary">Join Our Movement</h4>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Together, we're building a future where financial knowledge is accessible to all, 
                where every individual has the tools to create their own economic opportunities, 
                and where financial literacy becomes the foundation for breaking cycles of poverty 
                and building generational wealth.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Free Educational Resources</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Community Outreach Programs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Accessible Market Tools</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </div>
    </section>
  );
}